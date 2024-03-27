import {useCreateUser} from "@/openapi/user/api/users/users.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {Button} from "@/components/ui/button";
import {Label} from "@radix-ui/react-menubar";
import {Input} from "@/components/ui/input.tsx";
import {parseJwt} from "@/lib/jwt.ts";
import {ErrorResponse} from "@/vite-env";

type Inputs = {
    username: string
    nickname: string
}

const Anonymous = () => {

    const {token_endpoint, logout, login} = useContext(UserContext);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFail, setIsFail] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const { mutate } = useCreateUser({
        mutation: {
            onSuccess: async () => {
                let count = 0; // 호출 횟수를 세는 변수
                setIsSuccess(true);
                const intervalId = setInterval(async () => {
                    if (count >= 20) {
                        toast.error("관리자에게 문의하세요");
                        setIsFail(true);
                        clearInterval(intervalId);
                        return;
                    }
                    const response = await token_endpoint({
                        grant_type: "refresh_token",
                    });

                    const access_token = response.access_token

                    const {authority} = parseJwt(access_token);

                    if (authority === "USER") {
                        await logout();
                        login();
                    }

                    count++;
                }, 1000);
            },
            onError: (error) => {
                console.log(error);

                if (error.response?.data) {
                    const data = error.response?.data as ErrorResponse;
                    toast.error(data.message);
                }

                toast.error("관리자에게 문의하세요.");
            }
        }
    })

    const onSubmit: SubmitHandler<Inputs> = (data) => mutate({data: data});

    if (isFail) {
        return <div className="flex-1 flex justify-center items-center">
            관리자에게 문의해주세요.
        </div>
    }

    if (isSuccess) {
        return <div className="flex-1 flex justify-center items-center">
            회원가입이 완료되었습니다. 잠시만 기다려주세요.
        </div>
    }

    return (
        <div className="flex flex-1 justify-center items-center">
            <form className="flex-1 max-w-xl mx-auto space-y-12 mt-6" onSubmit={handleSubmit(onSubmit, () => {
                toast.error("필수 입력 필드를 확인해주세요.");
            })}>
                <div className="relative">
                    <Label className="mb-1">
                        <span>아이디</span>
                        <span className="text-red-400">*</span>
                    </Label>
                    <Input {...register("username", {
                        required: "아이디를 입력해주세요.",
                        pattern: {
                            value: /^[A-Za-z0-9]+$/,
                            message: "아이디는 영어와 숫자만 사용할 수 있습니다."
                        },
                        minLength: {
                            value: 4,
                            message: "아이디는 최소 4자 이상이어야 합니다.",
                        },
                        maxLength: {
                            value: 20,
                            message: "아이디는 최대 20자까지 가능합니다.",
                        },
                    })} />
                    <div className="absolute text-sm left-2 -bottom-6 text-red-500">{errors.username && errors.username.message}</div>
                </div>


                <div className="relative">
                    <Label className="mb-1">
                        <span>닉네임</span>
                        <span className="text-red-400">*</span>
                    </Label>
                    <Input {...register("nickname", {
                        required: "닉네임을 입력해주세요.",
                        pattern: {
                            value: /^[A-Z0-9가-힣]+$/,
                            message: "닉네임은 영대문자, 숫자, 한국어만 사용할 수 있습니다."
                        },
                        minLength: {
                            value: 4,
                            message: "닉네임은 최소 4자 이상이어야 합니다.",
                        },
                        maxLength: {
                            value: 20,
                            message: "닉네임은 최대 20자까지 가능합니다.",
                        },
                    })} />
                    <div className="absolute text-sm left-2 -bottom-6 text-red-500">{errors.nickname && errors.nickname.message}</div>
                </div>


                <Button type="submit" className="bg-primary hover:bg-primary-hover">회원가입</Button>
            </form>
        </div>
    )
}

export default Anonymous;