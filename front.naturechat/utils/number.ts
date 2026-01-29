export function formatPhone(value: string = '') {
    const numbers = value.replace(/\D/g, "")

    if (numbers.length <= 2) {
        return numbers
    } else if (numbers.length <= 3) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 7) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3)}`
    } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
}