"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Importações alteradas para lucide-react
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from "lucide-react";

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#193bb7] via-[#160fd4] to-black p-4">
      <Card className="w-full max-w-md bg-[#fbf7f7] shadow-2xl rounded-2xl border-none">
        <CardHeader className="space-y-3 pb-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors w-fit"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </Link>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription className="text-gray-500 font-medium">
              Entre na sua conta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Input de E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-800">
                E-mail :
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="@aluno.ce.gov.br"
                  className="pl-10 text-gray-900 placeholder:text-gray-500 bg-[#dcdcdc] border-transparent focus:bg-white focus:border-[#3b53c7] focus:ring-[#3b53c7] transition-all rounded-lg"
                />
              </div>
            </div>

            {/* Input de Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-800">
                Crie sua senha :
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="pl-10 pr-10 text-gray-900 placeholder:text-gray-500 bg-[#dcdcdc] border-transparent focus:bg-white focus:border-[#3b53c7] focus:ring-[#3b53c7] transition-all rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Opções: Lembrar e Esqueceu a Senha */}
            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-400 data-[state=checked]:bg-[#3b53c7]" />
                <Label 
                  htmlFor="remember" 
                  className="text-gray-600 cursor-pointer font-medium"
                >
                  Lembrar-me!
                </Label>
              </div>
              <Link href="#" className="text-[#3b53c7] hover:underline font-semibold">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Botão de Login */}
            <Button className="w-full bg-[#556cd6] hover:bg-[#3b53c7] text-white py-6 rounded-lg font-bold text-base transition-colors mt-2">
              Entrar
            </Button>
          </form>

          {/* Divisor "ou" */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#fbf7f7] px-3 text-gray-500 font-semibold">ou</span>
            </div>
          </div>

          {/* Botão do Google */}
          <Button
            variant="outline"
            className="w-full bg-[#dcdcdc] border-none hover:bg-[#cfcfcf] text-gray-800 py-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            onClick={() => console.log("Iniciar fluxo de login do Google")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>

        </CardContent>
      </Card>
    </main>
  );
}