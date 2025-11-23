import { useState } from "react"

import "../styles/Admin.css"
import fetchAuth from "../api/fetchAuth"
import fetchEmployees from "../api/fetchEmployees"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import ImageCropper from "../utils/ImageCropper"
import { HOME } from "../routes"


export default function EmployeeAdmin() {
    const { accessToken } = useUser()

    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()
    const [middleName, setMiddleName] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [phone, setPhone] = useState<string>()
    const [telegram, setTelegram] = useState<string>()
    const [vk, setVk] = useState<string>()
    const [description, setDescription] = useState<string>()
    const navigator = useNavigate()

    const [avatar, setAvatar] = useState<File>()
    const [tempAvatar, setTempAvatar] = useState<File>()

    const uploadAvatar = (event: React.FormEvent) => {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
            setTempAvatar(files[0])
        }
    }

    const createClick = async () => {
        if (firstName && lastName && email && phone && avatar) {
            const reqFormData: FormData = new FormData()

            reqFormData.append("firstName", firstName)
            reqFormData.append("lastName", lastName)
            reqFormData.append("email", email)
            reqFormData.append("phone", phone)
            reqFormData.append("photo", avatar)
            // необязательные поля
            if (middleName) reqFormData.append("middleName", middleName)
            if (description) reqFormData.append("description", description)
            if (telegram) reqFormData.append("telegram", telegram)
            if (vk) reqFormData.append("vk", vk)

            await fetchAuth.auth()
            if (!accessToken) {
                throw new Error("Авторизуйтесь")
            }
            await fetchEmployees.create(accessToken, reqFormData)
            navigator(HOME)

        } else {
            throw new Error("Необходимо заполнить все обязательные поля!")
        }
    }

    return (
        <div className="container">
            <div className="admin">
                <h1>Админ-агент</h1>
                <label htmlFor="firstName">Имя</label>
                <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Имя" />
                
                <label htmlFor="lastName">Фамилия</label>
                <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Фамилия" />
                
                <label htmlFor="middleName">Отчество</label>
                <input type="text" id="middleName" value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="Отчество" />
                
                <label htmlFor="avatar">Аватар актёра*</label>
                <>
                    <input type="file" onChange={uploadAvatar} />

                    {tempAvatar && (
                    <ImageCropper
                        imageFile={tempAvatar}
                        aspect={4 / 5}
                        onCropped={(cropped) => {
                        setAvatar(cropped);
                        setTempAvatar(undefined);
                        }}
                        onCancel={() => setTempAvatar(undefined)}
                    />
                    )}
                </>

                <h2>Данные для связи с агентом</h2>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
                
                <label htmlFor="phone">Телефон</label>
                <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="телефон" />
                
                <label htmlFor="telegram">Ссылка на telegram</label>
                <input type="text" id="telegram" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="telegram" />
                
                <label htmlFor="vk">Ссылка на страницу ВКонтакте</label>
                <input type="text" id="vk" value={vk} onChange={e => setVk(e.target.value)} placeholder="vk" />
                
                <label htmlFor="description">(опционально) описание / доп. данные</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="описание..." />

                <button onClick={createClick}>Создать агента</button>
            </div>
        </div>
    )
}