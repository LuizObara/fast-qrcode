import { QRCodeGenerator } from '@/components/qr-code-generator';
import { ModeToggle } from '@/components/mode-toggle';
import { Github, Linkedin } from 'lucide-react'

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-background to-muted ">
      <div className="max-w-3xl pt-4 md:p-8 min-h-screen  mx-auto flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Gerador de QR Code
          </h1>
          <ModeToggle />
        </header>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Gere um QR Code para qualquer conteúdo
            </h2>
            <p className="text-muted-foreground mb-6">
              Insira um link, texto, chave de acesso, credencial Wi-Fi, e-mail ou telefone — e baixe seu QR Code no formato desejado.
            </p>
            <QRCodeGenerator />
          </div>
        </div>

        <footer className="mt-auto  text-center text-sm text-muted-foreground">
          <div className="mt-1 flex justify-center gap-4 mb-4">
            <a
              href="https://github.com/LuizObara"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/luizobara"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
          <p>© {new Date().getFullYear()} Gerador de QR Code. Todos os direitos reservados.</p>
        </footer>
      </div>
    </main>
  );
}