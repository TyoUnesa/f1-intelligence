import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, session_id } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Mock F1 AI responses based on keywords
    const response = generateF1Response(message);

    return NextResponse.json({
      response,
      session_id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateF1Response(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('brawn gp') || lowerMessage.includes('2009')) {
    return `The 2009 Brawn GP was indeed revolutionary! Here's why:

**Technical Innovation:**
- They utilized a double diffuser, which was initially ruled legal
- Exceptional aerodynamic efficiency gave them a major advantage
- The car was lightweight and had excellent packaging

**Strategic Timing:**
- Mercedes engines were superior to their competitors
- The team had better fuel management systems
- They made smart pit stop strategies

**Dominant Performance:**
- Jenson Button won the championship with 15 wins
- Rubens Barrichello finished 2nd in the championship
- They led the constructors' championship decisively

The car's advantage was eventually addressed in the regulations, but for one magical season, Brawn GP proved that innovation and engineering excellence could overcome financial resources.`;
  }

  if (lowerMessage.includes('ground effect')) {
    return `Great question! Ground effect is one of F1's most important aerodynamic concepts:

**What is Ground Effect?**
Ground effect occurs when a vehicle moves close to the ground, creating a pressure difference that generates downforce.

**How It Works:**
1. Air flows under the car chassis between the ground
2. The restricted space accelerates the air
3. This creates lower pressure below the car (Bernoulli's principle)
4. The pressure difference pushes the car down

**Why It Matters in F1:**
- Increases cornering grip dramatically
- Allows higher speeds through corners
- Reduces reliance on large wing elements
- Makes the car more efficient

**Historical Note:**
- Ground effect was dominant in the 1970s-80s
- Banned briefly due to safety concerns
- Recently reintroduced in the 2022 regulations
- Modern F1 cars use controlled ground effect for efficiency

Modern F1 cars use sophisticated diffusers and tunnels to manage ground effect safely and efficiently!`;
  }

  if (lowerMessage.includes('best driver') || lowerMessage.includes('statistically')) {
    return `Determining the "best" F1 driver depends on what metrics you value:

**By Total Wins:**
- Lewis Hamilton: 103 wins
- Max Verstappen: 60+ wins
- Sebastian Vettel: 53 wins

**By Championships:**
- Lewis Hamilton: 7 World Championships
- Michael Schumacher: 7 World Championships
- Juan Manuel Fangio: 5 World Championships

**By Consistency (Podiums):**
- Lewis Hamilton leads with 200+ podiums
- Demonstrates remarkable consistency across seasons

**Other Considerations:**
- **Dominance Era:** Hamilton dominated 2014-2020 (Mercedes advantage)
- **Current Performance:** Max Verstappen showing sustained excellence
- **Peak Performance:** Ayrton Senna had incredible win percentage
- **Longevity:** Hamilton's sustained success over 15+ seasons

**The Verdict:**
While Hamilton has the most championships and wins, each era's best driver reflected both driver skill AND car advantage. Comparing across decades is complex due to technological differences. Most agree Hamilton ranks among the all-time greats based on championships, wins, and consistency.`;
  }

  if (lowerMessage.includes('spark') || lowerMessage.includes('night race')) {
    return `F1 cars spark at night races due to several factors:

**Main Reasons:**

1. **Titanium Skid Plates:**
   - Metal scrapes along the track surface
   - Creates friction and ignition
   - More visible at night

2. **Magnesium in Brakes:**
   - Ignites when exposed to extreme heat
   - Brake dust particles ignite in air
   - Spectacular visual effect at high speeds

3. **Track Temperature:**
   - Night races often cooler than day races
   - Metal interacts differently with cooler asphalt
   - Different material properties affect spark intensity

**Why You See It More at Night:**
- Contrast with dark sky makes sparks more visible
- Day races have sparks too, but you can't see them
- Television cameras capture it better

**Technical Evolution:**
- FIA has regulated skid plate materials
- Sparks are now part of the modern F1 aesthetic
- Considered safe by current standards

It's one of the most visually stunning aspects of modern F1 racing!`;
  }

  if (lowerMessage.includes('dinosaur')) {
    return `🦕 Haha, that's a fun one! If dinosaurs drove F1 cars:

**Stegosaurus Would Be the Engineer:**
- Those plates would make excellent aero elements
- Natural understanding of aerodynamic flow
- Probably designs the most innovative cars

**T-Rex Would Be Doomed:**
- Those tiny arms can't hold a steering wheel
- Terrible input response time
- Would be eliminated in qualifying

**Velociraptor Would Win:**
- Extremely quick reflexes and spatial awareness
- Natural predator instincts = racing instincts
- Could navigate Monza like it was hunting prey
- **Champion Material**

**Brachiosaurus Would Be a Safety Concern:**
- Way too tall for the cockpit
- Visibility issues completely blocked
- Might crash into the pit lane roof

**Ankylosaurus Would Go for Defense:**
- Natural spiked armor for contact sport
- Unbeatable in multi-car battles
- Probably aggressive with the F1 halo device

**Final Answer:** Velocirapttor would absolutely dominate! 🏁`;
  }

  // Default response
  return `That's an interesting question about Formula 1! I can provide more detailed information about:
- Driver statistics and achievements
- Team history and performance
- Race results and standings
- Technical car components (DRS, ground effect, etc.)
- Racing strategy and tactics
- Historical F1 facts and records

Could you ask me something more specific about Formula 1? I'd love to help explain the sport's most fascinating aspects!`;
}
