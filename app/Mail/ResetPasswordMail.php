<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        protected string $token,
        protected string $email
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(env('MAIL_FROM_ADDRESS'), 'simexanestesia.com'),
            subject: 'Restablece tu contraseña en SIMEXANESTESIA',
        );
    }

    public function content(): Content
    {
        $resetUrl = url("/reset-password/{$this->token}?email={$this->email}");

        return new Content(
            view: 'emails.resetPassword',
            with: [
                'resetUrl' => $resetUrl,
                'email' => $this->email,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}