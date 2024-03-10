import {useCreateUser} from "@/openapi/user/api/users/users.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {Button} from "@/components/ui/button";
import {Label} from "@radix-ui/react-menubar";
import {Input} from "@/components/ui/input.tsx";
import {parseJwt} from "@/lib/jwt.ts";

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
                console.log(error)
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
        <div className="flex flex-1">
            <form className="flex-1 max-w-xl mx-auto space-y-4 mt-6" onSubmit={handleSubmit(onSubmit)}>
                <Label>아이디</Label>
                <Input {...register("username", { required: true })} />

                <Label>닉네임</Label>
                <Input {...register("nickname", { required: true })} />

                <Button type="submit">회원가입</Button>
            </form>
        </div>
    )
}

export default Anonymous;