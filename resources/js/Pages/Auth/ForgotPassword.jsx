import InputError from '@/CustomComponents/form/InputError';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import TextInput from '@/CustomComponents/form/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-[var(--primary)]">
                Te enviaremos un correo para recuperar tu cuenta.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    placeholder="Correo electrónico"
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-center flex-col gap-4">
                    
                    <Link
                        href={route('login')}
                        className="text-sm text-[var(--primary)] underline hover:text-[var(--primary)]"
                    >
                        Ya puedo iniciar sesión
                    </Link>
                    
                    <PrimaryButton disabled={processing}>
                        Enviar restablecimiento
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
