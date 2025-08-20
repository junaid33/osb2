'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { PromptBuilder } from '../components/PromptBuilder'
import { useSearchParams } from 'next/navigation'

export function BuildPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoaded(true)
    
    // Check for alternative or tool query params
    const alternative = searchParams.get('alternative')
    const tool = searchParams.get('tool')
    
    if (alternative || tool) {
      console.log('Build page opened with:', alternative || tool)
      // The PromptBuilder will handle pre-selecting based on these params
    }
  }, [searchParams])


  const handlePromptChange = (prompt: string) => {
    setGeneratedPrompt(prompt)
  }

  const handleGenerateProject = () => {
    setShowOutput(true)
  }

  return (
    <div className="relative py-12 min-h-screen bg-black text-white">
        {!showOutput ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <PromptBuilder onPromptChange={handlePromptChange} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 max-w-5xl mx-auto px-4"
          >
            <Card className="border border-zinc-700 bg-zinc-900/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3 text-center">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold text-white"
                >
                  Your AI Implementation Guide
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-400"
                >
                  Ready to use prompt for AI-powered development
                </motion.p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-800 rounded-lg">
                    <h3 className="font-semibold mb-2 text-white">Generated Project Prompt:</h3>
                    <p className="text-sm leading-relaxed text-gray-300">{generatedPrompt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button 
                onClick={() => setShowOutput(false)}
                variant="outline"
                size="lg"
                className="group bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Builder
              </Button>
              <Button 
                size="lg"
                className="group bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create GitHub Repository
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        )}
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BuildPage