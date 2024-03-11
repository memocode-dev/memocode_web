import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useNavigate} from "react-router-dom";

const ProfileCard = () => {

    const {user_info} = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <div className="flex flex-col space-y-1">
            <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                    navigate('/')
                }}
            >
                MEMOCODE
            </div>

            {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" || user_info.username === "" ?
                <div></div>
                :
                <div className="flex items-center space-x-1">
                    <div className="text-sm">{user_info.nickname}</div>
                    <Avatar className="hover:animate-headShake w-6 h-6">
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>
                            <Skeleton className="w-6 h-6 rounded-full"/>
                        </AvatarFallback>
                    </Avatar>
                </div>
            }
        </div>
    )
}

export default ProfileCard