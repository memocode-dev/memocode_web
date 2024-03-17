import React, {ReactNode, useState} from "react";

type IVisibility = false | true;

interface IVisibilityContext {
    toggle: (fun: (prev: IVisibility) => IVisibility) => void;
    visibility: IVisibility;
}

export const VisibilityContext = React.createContext<IVisibilityContext>({
    toggle: () => {},
    visibility: false,
});

export function VisibilityProvider({children}: { children: ReactNode }) {
    const [visibility, setVisibility] = useState<IVisibility>(false);

    const toggle = (fun: (prev: IVisibility) => IVisibility) => {
        setVisibility(fun(visibility));
    }

    const value = {
        toggle,
        visibility,
    }

    return <VisibilityContext.Provider value={value}>{children}</VisibilityContext.Provider>;
}