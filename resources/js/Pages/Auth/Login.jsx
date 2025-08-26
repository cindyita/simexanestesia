import Checkbox from '@/CustomComponents/form/Checkbox';
import InputError from '@/CustomComponents/form/InputError';
import InputLabel from '@/CustomComponents/form/InputLabel';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import TextInput from '@/CustomComponents/form/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="pb-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-emerald-600">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="mt-2 flex flex-col gap-5 items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-xl text-sm text-emerald-600 underline hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Olvidé mi contraseña
                        </Link>
                    )}

                    <PrimaryButton disabled={processing}>
                        Iniciar sesión
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
