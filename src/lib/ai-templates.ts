interface AITemplate {
  id: string
  name: string
  description: string
  category: 'promotional' | 'maintenance' | 'educational' | 'seasonal'
  variables: string[]
  baseContent: {
    email: string
    sms: string
  }
}

interface GenerationOptions {
  template: string
  tone: 'Professional' | 'Friendly' | 'Urgent' | 'Casual'
  personalization: {
    customerName: string
    lastProcedure?: string
    loyaltyTier?: string
    customFields?: Record<string, string>
  }
}

// AI Templates based on common med spa marketing scenarios
export const AI_TEMPLATES: AITemplate[] = [
  {
    id: 'new-treatment',
    name: 'New Treatment Launch',
    description: 'Announce and promote a new treatment or service',
    category: 'promotional',
    variables: ['treatmentName', 'benefits', 'specialOffer', 'deadline'],
    baseContent: {
      email: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Dear {{customerName}},</p>
          <p>We're excited to introduce <strong>{{treatmentName}}</strong> to our treatment menu!</p>
          <p>This innovative treatment offers:</p>
          <ul style="margin: 20px 0;">{{benefits}}</ul>
          <div style="background-color: #f8f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; color: #9333ea;"><strong>{{specialOffer}}</strong></p>
          </div>
          <p>Book by <strong>{{deadline}}</strong> to secure your appointment.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Book Now</a>
          </div>
        </div>
      `,
      sms: `Hi {{customerName}}! New {{treatmentName}} now available. {{specialOffer}} Book by {{deadline}}.`
    }
  },
  {
    id: 'maintenance-reminder',
    name: 'Treatment Maintenance Reminder',
    description: 'Remind customers about their upcoming maintenance appointments',
    category: 'maintenance',
    variables: ['daysSinceLastTreatment', 'treatmentType', 'doctorName', 'availableSlots'],
    baseContent: {
      email: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hi {{customerName}},</p>
          <p>It's been <strong>{{daysSinceLastTreatment}} days</strong> since your last {{treatmentType}} treatment with {{doctorName}}.</p>
          <p>To maintain your amazing results, we recommend scheduling your next appointment.</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Available times this week:</strong></p>
            <ul style="margin: 0;">{{availableSlots}}</ul>
          </div>
          <p>Your regular treatment schedule helps ensure optimal results!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Book Appointment</a>
          </div>
        </div>
      `,
      sms: `Hi {{customerName}}! Time for your {{treatmentType}} touch-up with {{doctorName}}. {{availableSlots}} available. Book now!`
    }
  },
  {
    id: 'vip-exclusive',
    name: 'VIP Member Exclusive Offer',
    description: 'Special offers for loyalty program members',
    category: 'promotional',
    variables: ['exclusiveOffer', 'savingsAmount', 'validUntil', 'loyaltyPoints'],
    baseContent: {
      email: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Dear {{customerName}},</p>
          <p>As our valued <span style="color: #9333ea; font-weight: bold;">{{loyaltyTier}} member</span>, you've earned an exclusive reward!</p>
          <div style="background: linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%); padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #9333ea;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #1f2937;">{{exclusiveOffer}}</h2>
            <p style="margin: 0; font-size: 20px; color: #374151;">Your savings: <strong style="color: #9333ea;">{{savingsAmount}}</strong></p>
          </div>
          <p>Plus, earn <strong>{{loyaltyPoints}} bonus points</strong> with this treatment.</p>
          <p style="color: #dc2626;">This exclusive offer is valid until <strong>{{validUntil}}</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Claim Your Reward</a>
          </div>
        </div>
      `,
      sms: `{{customerName}}, your {{loyaltyTier}} exclusive: {{exclusiveOffer}} Save {{savingsAmount}}! Valid until {{validUntil}}.`
    }
  },
  {
    id: 'seasonal-promotion',
    name: 'Seasonal Promotion',
    description: 'Holiday or seasonal special offers',
    category: 'seasonal',
    variables: ['season', 'treatments', 'discount', 'bookingDeadline'],
    baseContent: {
      email: `
        <p>Hello {{customerName}},</p>
        <p>Get ready for {{season}} with our special promotion!</p>
        <p>Enjoy {{discount}} off these popular treatments:</p>
        <ul>{{treatments}}</ul>
        <p>Look and feel your best for the season ahead.</p>
        <p>Book by {{bookingDeadline}} to take advantage of these savings!</p>
      `,
      sms: `{{season}} Special! {{discount}} off select treatments. Book by {{bookingDeadline}}. Reply YES for details.`
    }
  },
  {
    id: 'education-skincare',
    name: 'Educational - Skincare Tips',
    description: 'Share skincare tips and build authority',
    category: 'educational',
    variables: ['tipTitle', 'tipContent', 'relatedTreatment', 'ctaText'],
    baseContent: {
      email: `
        <p>Hi {{customerName}},</p>
        <p>{{tipTitle}}</p>
        <p>{{tipContent}}</p>
        <p>Did you know? Our {{relatedTreatment}} treatment can help address these concerns professionally.</p>
        <p>{{ctaText}}</p>
      `,
      sms: `Skincare tip: {{tipTitle}}. Learn how {{relatedTreatment}} can help. Book a consultation today!`
    }
  }
]

// Tone modifiers to adjust the generated content
const TONE_MODIFIERS = {
  Professional: {
    greeting: ['Dear', 'Hello'],
    closing: ['Best regards', 'Sincerely', 'Warm regards'],
    style: 'formal and authoritative'
  },
  Friendly: {
    greeting: ['Hi', 'Hey there', 'Hello'],
    closing: ['Cheers', 'Take care', 'Looking forward to seeing you'],
    style: 'warm and conversational'
  },
  Urgent: {
    greeting: ['Attention', 'Important', 'Don\'t miss out'],
    closing: ['Act now', 'Limited time', 'Book today'],
    style: 'direct and time-sensitive'
  },
  Casual: {
    greeting: ['Hey', 'Hi there'],
    closing: ['Talk soon', 'See you soon', 'Catch you later'],
    style: 'relaxed and approachable'
  }
}

export function generateContent(
  options: GenerationOptions,
  contentType: 'email' | 'sms' = 'email'
): string {
  const template = AI_TEMPLATES.find(t => t.id === options.template)
  if (!template) {
    throw new Error('Template not found')
  }

  let content = template.baseContent[contentType]
  
  // Apply personalization
  content = content.replace(/{{customerName}}/g, options.personalization.customerName)
  
  if (options.personalization.lastProcedure) {
    content = content.replace(/{{lastProcedure}}/g, options.personalization.lastProcedure)
  }
  
  if (options.personalization.loyaltyTier) {
    content = content.replace(/{{loyaltyTier}}/g, options.personalization.loyaltyTier)
  }
  
  // Apply custom fields with default values
  const defaultValues: Record<string, string> = {
    treatmentName: 'Morpheus8 Skin Tightening',
    benefits: '<li>Stimulates collagen production</li><li>Tightens loose skin</li><li>Reduces fine lines and wrinkles</li><li>Minimal downtime</li>',
    specialOffer: '20% OFF First Treatment',
    deadline: 'December 31st',
    daysSinceLastTreatment: '90',
    treatmentType: 'Botox',
    doctorName: 'Dr. Johnson',
    availableSlots: '<li>Monday 9:00 AM</li><li>Wednesday 2:00 PM</li><li>Friday 10:00 AM</li>',
    exclusiveOffer: '30% OFF Any Treatment',
    savingsAmount: '$300',
    validUntil: 'December 31st',
    loyaltyPoints: '500',
    season: 'Holiday',
    treatments: '<li>Botox Touch-ups</li><li>Holiday Glow Facial</li><li>Laser Hair Removal</li>',
    discount: '25% OFF',
    bookingDeadline: 'December 20th',
    tipTitle: 'The Importance of Daily SPF',
    tipContent: 'Did you know that 90% of visible aging is caused by sun damage? Daily SPF application is your best defense against premature aging, dark spots, and skin cancer.',
    relatedTreatment: 'IPL PhotoFacial',
    ctaText: 'Learn more about our sun damage reversal treatments'
  }
  
  // Apply custom fields
  if (options.personalization.customFields) {
    Object.entries(options.personalization.customFields).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      content = content.replace(regex, value || defaultValues[key] || '')
    })
  }
  
  // Replace any remaining template variables with defaults
  template.variables.forEach(variable => {
    const regex = new RegExp(`{{${variable}}}`, 'g')
    if (content.match(regex)) {
      content = content.replace(regex, defaultValues[variable] || '')
    }
  })

  // Apply tone modifiers
  const toneModifier = TONE_MODIFIERS[options.tone]
  if (contentType === 'email' && toneModifier) {
    // Adjust greeting and closing based on tone
    const greeting = toneModifier.greeting[Math.floor(Math.random() * toneModifier.greeting.length)]
    const closing = toneModifier.closing[Math.floor(Math.random() * toneModifier.closing.length)]
    
    // Replace generic greetings/closings with tone-specific ones
    content = content.replace(/Dear|Hello|Hi/i, greeting)
    content = content + `<p>${closing},<br/>The ${options.personalization.customerName.split(' ')[1] || 'MedSpa'} Team</p>`
  }

  return content
}

export function generateSubjectLine(
  template: string,
  customerName: string,
  tone: string
): string {
  const subjectTemplates = {
    'new-treatment': [
      `${customerName}, be the first to try our new treatment`,
      `Exclusive: New treatment now available`,
      `Introducing our latest innovation`
    ],
    'maintenance-reminder': [
      `${customerName}, time for your touch-up`,
      `Your maintenance appointment reminder`,
      `Keep your results looking fresh`
    ],
    'vip-exclusive': [
      `Your VIP exclusive offer inside`,
      `${customerName}, your member benefits await`,
      `Special reward for our loyal members`
    ],
    'seasonal-promotion': [
      `Seasonal savings just for you`,
      `Get ready for the season with special offers`,
      `Limited-time seasonal treatments`
    ],
    'education-skincare': [
      `Pro skincare tips from our experts`,
      `Your personalized skincare guide`,
      `Discover the secret to radiant skin`
    ]
  }

  const templates = subjectTemplates[template] || [`Special offer for ${customerName}`]
  const subject = templates[Math.floor(Math.random() * templates.length)]

  // Add urgency for urgent tone
  if (tone === 'Urgent') {
    return `⏰ ${subject} - Limited Time!`
  }

  return subject
}

export function generatePreviewText(
  template: string,
  tone: string
): string {
  const previewTemplates = {
    'new-treatment': 'Discover how this innovative treatment can transform your skin',
    'maintenance-reminder': 'It\'s time to maintain your beautiful results',
    'vip-exclusive': 'Your exclusive member benefits are waiting',
    'seasonal-promotion': 'Special seasonal offers selected just for you',
    'education-skincare': 'Expert tips to enhance your skincare routine'
  }

  let preview = previewTemplates[template] || 'Special message from your med spa'

  if (tone === 'Urgent') {
    preview = 'Act fast - ' + preview.toLowerCase()
  }

  return preview
}