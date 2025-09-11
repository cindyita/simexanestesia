import InputError from '@/CustomComponents/form/InputError';
import InputLabel from '@/CustomComponents/form/InputLabel';
import PrimaryButton from '@/CustomComponents/button/PrimaryButton';
import TextInput from '@/CustomComponents/form/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import { FaKey } from "react-icons/fa";

export default function Register() {

    const key = usePage().props.key;
    const email = usePage().props.email;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: (email ?? ''),
        password: '',
        password_confirmation: '',
        register_key: (key ?? '')
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="pb-5">
                <div>
                    <InputLabel htmlFor="name" value="Nombre completo" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo electrónico" />
                    {
                        email ? (
                            
                            <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    className="mt-1 block w-full"
                                    disabled
                                    required
                                />
                        ) : (
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />    
                        )
                    }
                    
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4">
                    <div className="flex gap-2 items-center">
                        <FaKey className="text-sm text-yellow-500" />
                        <InputLabel
                        htmlFor="password_confirmation"
                            value="Clave de registro" />
                    </div>
                    {
                        key ? (
                            <TextInput
                                id="register_key"
                                type="text"
                                name="register_key"
                                value={key}
                                className="mt-1 block w-full"
                                required
                                disabled
                            />
                        ) : (
                                <TextInput
                                    id="register_key"
                                    type="text"
                                    name="register_key"
                                    value={data.register_key}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('register_key', e.target.value)
                                    }
                                    required
                                />
                        )
                    }
                    

                    <InputError
                        message={errors.register_key}
                        className="mt-2"
                    />
                </div>

                <div className="mt-2 flex flex-col gap-4 items-center justify-end">
                    <Link
                        href={route('login')}
                        className="text-sm text-[var(--primary)] underline hover:text-[var(--primary)]"
                    >
                        Ya tengo cuenta
                    </Link>

                    <PrimaryButton disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
