import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, plan, message } = body;

    // Validate required fields
    if (!name || !email || !plan || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Configure nodemailer with SendGrid SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '2525'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email content
    const emailContent = `
      <h2>New Demo Request from Odly Landing Page</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Plan Interest:</strong> ${plan}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.FROM_EMAIL, // Send to your own email
      replyTo: email, // Allow replying directly to the customer
      subject: `New Demo Request - ${plan} Plan - ${name}`,
      html: emailContent,
    });

    console.log('Contact form email sent successfully:', {
      name,
      email,
      plan,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Demo request sent successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}
