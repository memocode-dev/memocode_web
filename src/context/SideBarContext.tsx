'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ISideBarContext {
    sidebarWidth: number;
    setSidebarWidth: (fun: (prev: ISideBar) => ISideBar) => void;
}

type ISideBar = number;

const SidebarContext = createContext<ISideBarContext | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarWidth, setSidebarWidth] = useState(300);

    return (
        <SidebarContext.Provider value={{ sidebarWidth, setSidebarWidth }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
