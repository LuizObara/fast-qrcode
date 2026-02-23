"use client";

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  LinkIcon,
  Download,
  FileImage,
  FileCode2,
  RotateCw,
  AlertCircle,
  Type,
  KeyRound,
  Wifi,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

type ContentType = 'url' | 'text' | 'access-key' | 'wifi' | 'email' | 'phone';

interface ContentTypeOption {
  value: ContentType;
  label: string;
  placeholder: string;
  icon: React.ElementType;
  multiline?: boolean;
}

const CONTENT_TYPES: ContentTypeOption[] = [
  {
    value: 'url',
    label: 'Link / URL',
    placeholder: 'https://exemplo.com',
    icon: LinkIcon,
  },
  {
    value: 'text',
    label: 'Texto',
    placeholder: 'Digite qualquer texto...',
    icon: Type,
    multiline: true,
  },
  {
    value: 'access-key',
    label: 'Chave / Hash',
    placeholder: 'Ex: abc123-xyz789 ou qualquer código de acesso',
    icon: KeyRound,
  },
  {
    value: 'wifi',
    label: 'Wi-Fi',
    placeholder: 'WIFI:T:WPA;S:NomeDaRede;P:SenhaDaRede;;',
    icon: Wifi,
    multiline: true,
  },
  {
    value: 'email',
    label: 'E-mail',
    placeholder: 'mailto:contato@exemplo.com',
    icon: Mail,
  },
  {
    value: 'phone',
    label: 'Telefone',
    placeholder: 'tel:+5511999999999',
    icon: Phone,
  },
];

export function QRCodeGenerator() {
  const [content, setContent] = useState('');
  const [qrContent, setQrContent] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType>('url');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const currentTypeConfig = CONTENT_TYPES.find(t => t.value === selectedType)!;

  const validate = (value: string): string => {
    if (!value.trim()) return 'O conteúdo não pode estar vazio.';

    if (selectedType === 'url') {
      try {
        const urlObj = new URL(value);
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
          return 'URLs precisam começar com http:// ou https://';
        }
      } catch {
        return 'Por favor, insira uma URL válida (ex: https://exemplo.com)';
      }
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error && e.target.value) setError('');
  };

  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type);
    setContent('');
    setQrContent('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsGenerating(true);

    setTimeout(() => {
      setQrContent(content.trim());
      setIsGenerating(false);
    }, 400);
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !currentTypeConfig.multiline) {
      handleSubmit(e);
    }
  };

  // Lida com o download do QR Code
  const downloadQRCode = (format: 'svg' | 'png') => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    let downloadUrl: string;
    if (format === 'svg') {
      const serializer = new XMLSerializer();
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.setAttribute('width', '256');
      svgElement.setAttribute('height', '256');
      svgElement.setAttribute('viewBox', '0 0 256 256');

      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('width', '256');
      foreignObject.setAttribute('height', '256');

      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png');

      foreignObject.appendChild(img);
      svgElement.appendChild(foreignObject);

      const svgString = serializer.serializeToString(svgElement);
      downloadUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    } else {
      downloadUrl = canvas.toDataURL('image/png');
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `qrcode-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Icon = currentTypeConfig.icon;

  return (
    <div className="space-y-6">
      {/* Seletor de tipo de conteúdo */}
      <div className="space-y-2">
        <Label>Tipo de conteúdo</Label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CONTENT_TYPES.map((type) => {
            const TypeIcon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeChange(type.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium transition-all duration-150",
                  "hover:bg-muted hover:border-primary/40",
                  selectedType === type.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                <TypeIcon className="h-4 w-4" />
                <span className="leading-tight text-center">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <div className="relative">
            <div className={cn(
              "absolute left-0 flex items-center pl-3 pointer-events-none",
              currentTypeConfig.multiline ? "top-3" : "inset-y-0"
            )}>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>

            {currentTypeConfig.multiline ? (
              <Textarea
                id="content"
                placeholder={currentTypeConfig.placeholder}
                value={content}
                onChange={handleChange}
                rows={3}
                className={cn(
                  "pl-10 resize-none",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={!!error}
              />
            ) : (
              <Input
                id="content"
                type="text"
                placeholder={currentTypeConfig.placeholder}
                value={content}
                onChange={handleChange}
                onKeyDown={handleEnterKey}
                className={cn(
                  "pl-10",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={!!error}
              />
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Dicas contextuais para Wi-Fi */}
          {selectedType === 'wifi' && (
            <p className="text-xs text-muted-foreground">
              Formato: <code className="bg-muted px-1 rounded">WIFI:T:WPA;S:NomeDaRede;P:Senha;;</code> — Substitua os campos pelo nome e senha da sua rede.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!content || isGenerating}
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

      {/* Resultado */}
      {qrContent && (
        <div className="space-y-4 animate-in fade-in">
          <div
            ref={qrRef}
            className="flex justify-center items-center p-6 bg-white rounded-lg border mx-auto max-w-xs"
          >
            <QRCodeCanvas
              value={qrContent}
              size={200}
              level="H"
              includeMargin
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