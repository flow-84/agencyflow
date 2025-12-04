import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eraser, Check, FileText, Download } from "lucide-react";

export default function SignatureDialog({ open, onOpenChange, document, onSign }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      setHasSignature(false);
      setAgreed(false);
    }
  }, [open]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = async () => {
    if (!hasSignature || !agreed) return;
    
    setSigning(true);
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL("image/png");
    
    await onSign(document, signatureDataUrl);
    setSigning(false);
    onOpenChange(false);
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-600" />
            {document.title}
          </DialogTitle>
          <DialogDescription>
            Bitte lies den Vertrag sorgfältig durch und unterschreibe unten.
          </DialogDescription>
        </DialogHeader>

        {/* Document Preview */}
        <div className="flex-1 min-h-0">
          <div className="mb-4">
            <Label className="text-sm font-medium">Dokument</Label>
            {document.file_url ? (
              <div className="mt-2 border rounded-lg overflow-hidden bg-slate-50">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Dokument öffnen um den Inhalt zu lesen
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Öffnen
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-8 border rounded-lg bg-slate-50 text-center text-slate-500">
                Kein Dokument verfügbar
              </div>
            )}
          </div>

          {/* Signature Pad */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Deine Unterschrift</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSignature}
                className="text-slate-500"
              >
                <Eraser className="w-4 h-4 mr-1" />
                Löschen
              </Button>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="w-full touch-none cursor-crosshair"
                style={{ maxHeight: "150px" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              Unterschreibe mit der Maus oder dem Finger im Feld oben
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 mt-4 p-4 bg-slate-50 rounded-lg">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={setAgreed}
            />
            <Label htmlFor="agree" className="text-sm text-slate-600 cursor-pointer">
              Ich habe das Dokument gelesen und erkläre mich mit dem Inhalt einverstanden. 
              Meine digitale Unterschrift ist rechtlich bindend.
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSign}
            disabled={!hasSignature || !agreed || signing}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {signing ? (
              "Wird unterschrieben..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Verbindlich unterschreiben
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}