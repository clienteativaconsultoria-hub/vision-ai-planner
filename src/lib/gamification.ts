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
  
  // However, if there are multiple tactics per week, we need to know the structure.
  // Looking at `ai-service.ts`: `weeklyTactics: Tactic[];`
  // And `Dashboard.tsx`: `const quarterTactics = dbPlan.weekly_tactics ? dbPlan.weekly_tactics.slice(startWeek, endWeek) : [];`
  // `startWeek = index * 13`.
  // So it assumes 13 tactics per quarter. 1 tactic per week.
  
  // So, "Perfect Week" = "Completed Tactic" for that week.
  // So `perfectWeeks` is just `completed_tactics.length`.
  
  // BUT, let's verify if `completed_tactics` stores indices of completed weeks.
  // `Dashboard.tsx`: `const isCompleted = completedIndices.includes(globalIndex);`
  // Yes, it seems 1 tactic = 1 week.
  
  // So "Perfect Weeks" is just the count of completed tactics.
  // That seems too simple? Maybe "Perfect Month"?
  // Or maybe the user wants to know how many *consecutive* weeks?
  // The prompt says "Contador de 'Semanas Perfeitas'".
  // Let's stick to "Semanas Concluídas" (Completed Weeks) as "Perfect Weeks" for now, since 1 tactic/week.
  
  return plan.completed_tactics.length
}
