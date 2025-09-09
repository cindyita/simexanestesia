<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
//use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegisterKeyMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(protected string $clave)
    {
        
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(env('MAIL_FROM_ADDRESS'), 'simexanestesia.com'),
            subject: 'Tu clave de registro para SIMEXANESTESIA',
        );
    }

    public function content(): Content
    {
        return new Content(

            view: 'emails.registerKey',

            with: [
                'key' => $this->clave
            ],

        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
