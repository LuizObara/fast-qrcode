"use client";

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { LinkIcon, Download, FileImage, FileCode2, RotateCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Valida o formato da URL
  const validateUrl = (value: string) => {
    try {
      const urlObj = new URL(value);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value === '') {
      setIsValid(true);
    } else {
      setIsValid(validateUrl(e.target.value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) return;

    if (!validateUrl(url)) {
      setIsValid(false);
      return;
    }

    setIsGenerating(true);

    // Simula um pequeno atraso de rede
    setTimeout(() => {
      setQrUrl(url);
      setIsGenerating(false);
    }, 500);
  };

  // Lida com o download do QR Code
  const downloadQRCode = (format: 'svg' | 'png') => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    let downloadUrl;
    if (format === 'svg') {
      // Para SVG, cria um elemento SVG e converte o canvas para SVG
      const serializer = new XMLSerializer();
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.setAttribute('width', '256');
      svgElement.setAttribute('height', '256');
      svgElement.setAttribute('viewBox', '0 0 256 256');

      // Cria um foreignObject para embutir o conteúdo do canvas
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('width', '256');
      foreignObject.setAttribute('height', '256');

      // Clona o canvas como uma imagem
      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');

      // Anexa os elementos
      foreignObject.appendChild(img);
      svgElement.appendChild(foreignObject);

      // Converte para uma URL de dados SVG
      const svgString = serializer.serializeToString(svgElement);
      downloadUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    } else {
      // Para PNG, obtém a URL diretamente do canvas
      downloadUrl = canvas.toDataURL('image/png');
    }

    // Cria e dispara o link de download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `qrcode-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              id="url"
              type="text"
              placeholder="https://exemplo.com"
              value={url}
              onChange={handleChange}
              onKeyDown={handleEnterKey}
              className={cn(
                "pl-10",
                !isValid && "border-destructive focus-visible:ring-destructive"
              )}
              aria-invalid={!isValid}
            />
          </div>
          {!isValid && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Por favor, insira uma URL válida (incluindo http:// ou https://)
              </AlertDescription>
            </Alert>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={!url || !isValid || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            "Gerar QR Code"
          )}
        </Button>
      </form>

      {qrUrl && (
        <div className="space-y-4 animate-in fade-in">
          <div 
            ref={qrRef} 
            className="flex justify-center items-center p-6 bg-white rounded-lg border mx-auto max-w-xs"
          >
            <QRCodeCanvas
              value={qrUrl}
              size={200}
              level="H"
              includeMargin
              imageSettings={{
                src: "",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>

          <div className="flex justify-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadQRCode('svg')}
                    className="flex-1"
                  >
                    <FileCode2 className="mr-2 h-4 w-4" />
                    SVG
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar como SVG (formato vetorial)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadQRCode('png')}
                    className="flex-1"
                  >
                    <FileImage className="mr-2 h-4 w-4" />
                    PNG
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Baixar como PNG (formato de imagem)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}