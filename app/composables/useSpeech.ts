import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export const useSpeech = () => {
  const config = useRuntimeConfig()
  const generatingSpeech = ref(false)

  const generateSpeech = async (text: string) => {
    try {
      generatingSpeech.value = true
      const endpoint = config.public.cloudFunctionAudioUrl;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const data = await response.json()
      const audioBase64 = data.audioContent
      const audioBlob = base64ToBlob(audioBase64, 'audio/mp3')
      const audioUrl = URL.createObjectURL(audioBlob)
      const audioFile = new File([audioBlob], `${text}.mp3`, { type: 'audio/mp3' })

      return { audioUrl, audioFile }
    } catch (error) {
      console.error('Audio generation error:', error)
      throw error
    } finally {
      generatingSpeech.value = false
    }
  }

  const base64ToBlob = (base64: string, type: string) => {
    const binStr = atob(base64)
    const len = binStr.length
    const arr = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i)
    }
    return new Blob([arr], { type })
  }

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  return {
    generatingSpeech,
    generateSpeech,
    playAudio
  }
}
