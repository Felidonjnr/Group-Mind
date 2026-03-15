// ─── CALENDAR INTELLIGENCE ───────────────────────────────────────────────────

const GLOBAL_EVENTS = {
  "01-01":"New Year's Day 🎆","01-15":"Martin Luther King Jr. Day",
  "02-04":"World Cancer Day 🎗️","02-14":"Valentine's Day 💝",
  "02-20":"World Day of Social Justice","03-08":"International Women's Day 👩",
  "03-21":"World Poetry Day 📜","03-22":"World Water Day 💧",
  "04-01":"April Fools' Day 😄","04-07":"World Health Day 🏥",
  "04-22":"Earth Day 🌍","04-23":"World Book Day 📚",
  "05-01":"Workers' Day / Labour Day 🛠️","05-04":"Star Wars Day ⭐",
  "05-17":"World Telecommunication Day 💻","05-31":"World No-Tobacco Day",
  "06-01":"Children's Day 👶","06-05":"World Environment Day 🌿",
  "06-08":"World Oceans Day 🌊","06-16":"Day of the African Child",
  "06-21":"World Music Day 🎵","07-11":"World Population Day",
  "07-30":"International Friendship Day 🤝","08-12":"International Youth Day 🌟",
  "09-05":"International Day of Charity","09-08":"International Literacy Day 📖",
  "09-21":"International Day of Peace ☮️","10-01":"Nigeria Independence Day 🇳🇬",
  "10-04":"World Animal Day 🐾","10-10":"World Mental Health Day 🧠",
  "10-11":"International Day of the Girl","10-16":"World Food Day 🍽️",
  "10-31":"Halloween 🎃","11-16":"International Day for Tolerance",
  "12-01":"World AIDS Day 🎗️","12-03":"Day of Persons with Disabilities",
  "12-10":"Human Rights Day","12-25":"Christmas Day 🎄","12-31":"New Year's Eve 🎉",
};

export function getTodayContext() {
  const now = new Date();
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const mm = String(now.getMonth()+1).padStart(2,"0");
  const dd = String(now.getDate()).padStart(2,"0");
  const weekNum = Math.ceil(now.getDate() / 7);
  return {
    dayName: DAYS[now.getDay()],
    month: MONTHS[now.getMonth()],
    date: now.getDate(),
    year: now.getFullYear(),
    fullDate: `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`,
    event: GLOBAL_EVENTS[`${mm}-${dd}`] || null,
    isWeekend: now.getDay()===0 || now.getDay()===6,
    isMonday: now.getDay()===1,
    isFriday: now.getDay()===5,
    isSunday: now.getDay()===0,
    weekOfMonth: weekNum,
    isFirstWeek: weekNum===1,
    isLastDay: dd === String(new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()).padStart(2,"0"),
  };
}

// ─── AI GENERATION ───────────────────────────────────────────────────────────

export async function generateForGroup(group, recentHistory, todayCtx, apiKey, extraInstruction="") {
  const recent = recentHistory.slice(0,5).map((h,i)=>`[${i+1}] ${h.content}`).join("\n---\n");

  const system = `You are an expert WhatsApp community content strategist working for a creative media professional in Nigeria. You craft messages that feel genuinely human, deeply relevant, and perfectly matched to each group's unique culture and current moment.

Your messages:
- Feel like they came from a real person who deeply understands the group
- Are perfectly sized for WhatsApp — human, punchy, scannable
- Never sound AI-generated, robotic, or generic
- Naturally weave in today's date, global observances, and real group conversations when relevant
- Rotate content types naturally: motivational, tips, questions, stories, challenges, news, devotional, community-building, etc.
- NEVER repeat angles, formats, or content from recent history
- Output ONLY the final message. No labels. No explanations. No preamble. No quotes around it.`;

  const user = `━━━ TODAY'S WORLD CONTEXT ━━━
Date: ${todayCtx.fullDate}
${todayCtx.event ? `🌍 Global Observance: ${todayCtx.event}` : "No major global observance today."}
${todayCtx.isMonday ? "🌅 Monday — fresh start energy, new week." : ""}
${todayCtx.isFriday ? "🎉 Friday — end of week, celebratory energy." : ""}
${todayCtx.isSunday ? "🙏 Sunday — reflective, devotional energy." : ""}
${todayCtx.isWeekend && !todayCtx.isSunday ? "😌 Saturday — relaxed weekend energy." : ""}
${todayCtx.isFirstWeek ? "📅 First week of the month — fresh month energy." : ""}

━━━ GROUP PROFILE ━━━
Name: ${group.name} ${group.emoji}
Who They Are: ${group.description}
Tone & Style: ${group.tone}
Topics They Love: ${group.topics || "General"}
Always Avoid: ${group.avoid || "Nothing specific"}
Posting Schedule: ${group.frequency}

━━━ DEEP GROUP KNOWLEDGE ━━━
${group.knowledgeDump || "No deep knowledge provided yet — generate best general content."}

━━━ WHAT THEY'RE CURRENTLY TALKING ABOUT ━━━
${group.conversationDump || "No recent conversations provided — generate fresh relevant content."}

━━━ RECENT MESSAGES SENT — DO NOT REPEAT THESE ━━━
${recent || "None yet — this is the very first message for this group."}

${extraInstruction ? `━━━ TODAY'S SPECIAL INSTRUCTION ━━━\n${extraInstruction}` : ""}

Generate today's perfect WhatsApp message now. Make it alive, timely, and completely human.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }]
    })
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}
