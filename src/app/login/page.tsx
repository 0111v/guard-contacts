'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/auth'
import { LogoIcon } from '@/components/icons/LogoIcon'
import { CheckIcon, XIcon } from '@/components/icons/ValidationIcons'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  
  const { user, loading, error, login, register, clearError } = useAuthStore()
  const router = useRouter()

  // password validation
  const isPasswordLongEnough = password.length >= 8
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''
  const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    // clear errors when switching between login/register
    clearError()
  }, [isRegister, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      return
    }

    try {
      if (isRegister) {
        await register({ email: email.trim(), password })
      } else {
        await login({ email: email.trim(), password })
      }
      
      // success - user will be redirected by useEffect
    } catch (err) {
      // error is handled by the store
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setHasAttemptedSubmit(false)
  }

  return (
    <div className='flex min-h-screen'>
      {/* left side */}
      <div
        className="flex-[3] relative overflow-hidden"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: '130%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#111111'
        }}>
        {/* blur effect */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xl"></div>
        
        {/* logo */}
        <div className="flex items-center justify-center gap-4 absolute top-12 left-24 z-10">
          <LogoIcon className='w-10 h-10 text-accent-brand'/>
          <span className='text-4xl font-bold'>GUARD</span>
        </div>
      </div>
      
      {/* right side */}
      <div className="flex-[2] flex items-center justify-center bg-background-secondary relative">
        {/* don't have account link */}
        <div className="absolute top-8 right-8 z-10">
          <span className='mr-2 text-text-medium'>{isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}</span>
          <button
            type="button"
            onClick={toggleMode}
            className="text-accent-brand hover:text-accent-brand/85 text-text-medium"
          >
            {isRegister 
              ? 'Acessar conta' 
              : "Criar conta"}
          </button>
        </div>
        
        {/* main form */}
        <div className="w-full max-w-md space-y-8 p-8">
          <div>
            <h2 className="text-3xl font-extrabold text-content-primary">
              {isRegister ? 'Criar conta' : 'Acessar conta'}
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="email" className="block text-text-large text-content-primary">
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-content-muted rounded-md shadow-sm focus:outline-none focus:ring-accent-brand focus:border-accent-brand placeholder:text-sm"
                    placeholder="Digite seu nome"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-text-large text-content-primary">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-content-muted rounded-md shadow-sm focus:outline-none focus:ring-accent-brand focus:border-accent-brand placeholder:text-sm"
                  placeholder="Digite seu email"
                />
                {hasAttemptedSubmit && email && !emailCheck && (
                  <p className="mt-1 text-sm text-red-600">
                    Por favor, digite um email válido
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-text-large text-content-primary">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-content-muted rounded-md shadow-sm focus:outline-none focus:ring-accent-brand focus:border-accent-brand placeholder:text-sm"
                  placeholder="Digite sua senha"
                  minLength={8}
                />
                
                {/* Password validation messages */}
                {isRegister && password && (
                  <div className="mt-2 ml-2 space-y-1">
                    <div className={`flex items-center gap-2 text-text-medium ${isPasswordLongEnough ? 'text-green-600' : 'text-red-600'}`}>
                      {isPasswordLongEnough ? <CheckIcon /> : <XIcon />}
                      <span>Pelo menos 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-2 text-text-medium ${hasNumberOrSymbol ? 'text-green-600' : 'text-red-600'}`}>
                      {hasNumberOrSymbol ? <CheckIcon /> : <XIcon />}
                      <span>Contém um número ou símbolo</span>
                    </div>
                  </div>
                )}
              </div>

              {isRegister && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-text-large text-content-primary">
                    Repitir a senha
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-content-muted rounded-md shadow-sm focus:outline-none focus:ring-accent-brand focus:border-accent-brand placeholder:text-sm"
                    placeholder="Repita sua senha para confirmar"
                  />
                  
                  {/* Password match validation */}
                  {confirmPassword && (
                    <div className="mt-2 ml-2">
                      <div className={`flex items-center gap-2 text-text-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordsMatch ? <CheckIcon /> : <XIcon />}
                        <span>As senhas devem ser iguais</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='flex justify-end'>
              <button
                type="submit"
                onClick={() => setHasAttemptedSubmit(true)}
                disabled={loading || !email.trim() || !password.trim() || (isRegister && (!name.trim() || !isPasswordLongEnough || !hasNumberOrSymbol || !passwordsMatch))}
                className="flex justify-center py-3 px-4 border border-transparent text-text-medium font-medium rounded-lg text-background-primary bg-accent-brand hover:brightness-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Loading...' : isRegister ? 'Criar conta' : 'Acessar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}