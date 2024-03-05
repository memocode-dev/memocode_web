import {useCreateUser} from "@/openapi/user/api/users/users.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {Button} from "@/components/ui/button";
import {Label} from "@radix-ui/react-menubar";
import {Input} from "@/components/ui/input.tsx";

type Inputs = {
    username: string
    nickname: string
}

const Anonymous = () => {

    const {login, logout} = useContext(UserContext)

    const {
        register,
        handleSubmit,
    } = useForm<Inputs>()

    const { mutate } = useCreateUser({
        mutation: {
            onSuccess: async (_) => {
                console.log(_)
                await logout()
                login()
            },
            onError: (error, variables, context) => {
                console.log(error)
                console.log(variables)
                console.log(context)
                toast.error("에러발생!!")
            }
        }
    })

    const onSubmit: SubmitHandler<Inputs> = (data) => mutate({data: data})

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