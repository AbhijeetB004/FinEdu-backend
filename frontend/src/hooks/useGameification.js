import { useContext } from 'react'
import GameContext from '../context/GameContext'

export const useGameification = () => {
  const context = useContext(GameContext)
  
  if (!context) {
    throw new Error('useGameification must be used within a GameProvider')
  }
  
  return context
}

// Alias for useGame
export const useGame = useGameification

export default useGameification