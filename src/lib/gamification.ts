import { supabase } from "./supabase"

export interface UserStreak {
  current_streak: number
  longest_streak: number
  last_active_date: string | null
}

export async function checkAndUpdateStreak(userId: string): Promise<UserStreak | null> {
  try {
    // 1. Get current profile data
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_active_date')
      .eq('id', userId)
      .single()

    if (error) throw error

    const profile = profileData as any
    const today = new Date().toISOString().split('T')[0]
    const lastActive = profile.last_active_date
    
    let newStreak = profile.current_streak || 0
    let newLongest = profile.longest_streak || 0
    let shouldUpdate = false

    // If already active today, just return current stats
    if (lastActive === today) {
      return profile
    }

    // Calculate date difference
    if (lastActive) {
      const lastDate = new Date(lastActive)
      const todayDate = new Date(today)
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1
        if (newStreak > newLongest) newLongest = newStreak
        shouldUpdate = true
      } else if (diffDays > 1) {
        // Broken streak
        newStreak = 1
        shouldUpdate = true
      }
    } else {
      // First time active
      newStreak = 1
      newLongest = 1
      shouldUpdate = true
    }

    if (shouldUpdate) {
      const { error: updateError } = await (supabase.from('profiles') as any)
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_active_date: today
        })
        .eq('id', userId)

      if (updateError) throw updateError
    }

    return {
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today
    }

  } catch (error) {
    console.error("Error updating streak:", error)
    return null
  }
}

export function calculatePerfectWeeks(plan: any): number {
  if (!plan || !plan.weekly_tactics || !plan.completed_tactics) return 0

  new Set(plan.completed_tactics)
  const perfectWeeks = 0
  
  // Logic commented out due to type inconsistency in plan structure
  // const totalWeeks = 52 
  // ...
  
  return perfectWeeks
}
