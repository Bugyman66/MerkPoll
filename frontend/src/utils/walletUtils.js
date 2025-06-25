// Utility functions for Petra Wallet detection and installation

export const detectPetraWallet = () => {
  return typeof window !== 'undefined' && window.aptos !== undefined
}

export const isPetraInstalled = () => {
  return detectPetraWallet()
}

export const openPetraInstallPage = () => {
  window.open('https://petra.app/', '_blank')
}

export const showPetraInstallInstructions = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  let instructions = 'Please install Petra Wallet:\n\n'
  
  if (userAgent.includes('chrome')) {
    instructions += '1. Visit https://petra.app/\n'
    instructions += '2. Click "Add to Chrome"\n'
    instructions += '3. Follow the installation steps\n'
    instructions += '4. Refresh this page and try again'
  } else if (userAgent.includes('firefox')) {
    instructions += '1. Visit https://petra.app/\n'
    instructions += '2. Click "Add to Firefox"\n'
    instructions += '3. Follow the installation steps\n'
    instructions += '4. Refresh this page and try again'
  } else {
    instructions += '1. Visit https://petra.app/\n'
    instructions += '2. Download for your browser\n'
    instructions += '3. Follow the installation steps\n'
    instructions += '4. Refresh this page and try again'
  }
  
  return instructions
}

export const waitForPetraInstallation = (callback, maxAttempts = 30) => {
  let attempts = 0
  
  const checkInterval = setInterval(() => {
    attempts++
    
    if (isPetraInstalled()) {
      clearInterval(checkInterval)
      callback(true)
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval)
      callback(false)
    }
  }, 1000) // Check every second
}
