import toast from "react-hot-toast"

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard', {
        position: 'top-center',
        icon: '👏',
        style: {
            borderRadius: '15px',
            background: '#141212',
            color: '#fff',
        },
    })
}