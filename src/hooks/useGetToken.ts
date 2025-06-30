import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

interface MyJwtPayload {
    id: string;
    nome: string;
    email: string;
    imagemPerfil: string;
    role: string;
    exp?: number;
}

export const useGetToken = () => {
    const [tokenData, setTokenData] = useState<MyJwtPayload | null | undefined>(undefined); // undefined = carregando, null = não logado

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log('[DEBUG useGetToken] Token bruto:', token);

        if (token) {
            try {
                const decodedToken = jwtDecode<MyJwtPayload>(token);
                console.log('[DEBUG useGetToken] Token decodificado:', decodedToken);
                
                // Verificar se o token expirou (apenas se o campo exp existir)
                if (decodedToken.exp) {
                    const currentTime = Date.now() / 1000; // em segundos
                    console.log('[DEBUG useGetToken] exp:', decodedToken.exp, 'agora:', currentTime);
                    
                    if (currentTime > decodedToken.exp) {
                        console.log('[DEBUG useGetToken] Token expirado!');
                        localStorage.removeItem("token");
                        setTokenData(null);
                        return;
                    }
                }
                
                setTokenData(decodedToken);
            } catch (error) {
                console.error("[DEBUG useGetToken] Erro ao decodificar o token:", error);
                localStorage.removeItem("token");
                setTokenData(null);
            }
        } else {
            setTokenData(null);
        }
    }, []);

    return tokenData;
};
