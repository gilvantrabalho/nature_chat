export async function sendMessage(number: string, message: string) {
    if (!number || !message) {
        throw new Error("Número e mensagem são obrigatórios");
    }

    // Remove tudo que não for número
    const telefoneReplace = number.replace(/\D/g, "");

    // Mesmo tratamento do PHP:
    // substr($telefone_replace, 0, 2) . substr($telefone_replace, 3)
    const telefone =
        telefoneReplace.substring(0, 2) + telefoneReplace.substring(3);

    const data = {
        numbers: [
            `55${telefone}`,
            `55${telefoneReplace}`
        ],
        message: message
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_WHATSAPP}send-message`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": process.env.NEXT_PUBLIC_EVOLUTION_API_KEY as string
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        throw new Error("Falha ao enviar mensagem");
    }

    return response.json();
}
