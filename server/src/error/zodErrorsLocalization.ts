import { z, ZodIssueCode } from "zod"

z.setErrorMap((issue, ctx) => {
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            return { message: "Неверный тип данных" }

        case ZodIssueCode.invalid_string:
            if (issue.validation === "email") {
                return { message: "Некорректный email" }
            }
            return { message: "Некорректная строка" }

        case ZodIssueCode.too_small:
            if (issue.minimum === 7) {
                return { message: "Пароль должен быть не короче 7 символов" }
            }
            return { message: "Слишком короткое значение" }

        case ZodIssueCode.too_big:
            return { message: "Слишком длинное значение" }

        default:
            return { message: ctx.defaultError }
    }
})
