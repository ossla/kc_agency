import { useState } from "react"

interface TagEditorProps {
    label: string
    values: string[]
    onChange: (values: string[]) => void
    suggestions?: string[]
    placeholder?: string
}

export default function TagEditor({
    label,
    values,
    onChange,
    suggestions = [],
    placeholder = "Add item"
}: TagEditorProps) {
    const [inputValue, setInputValue] = useState("")

    const addValue = (rawValue: string) => {
        const nextValue = rawValue.trim()
        if (!nextValue) return

        const exists = values.some(value => value.toLowerCase() === nextValue.toLowerCase())
        if (exists) {
            setInputValue("")
            return
        }

        onChange([...values, nextValue])
        setInputValue("")
    }

    const removeValue = (valueToRemove: string) => {
        onChange(values.filter(value => value !== valueToRemove))
    }

    const availableSuggestions = suggestions.filter(
        suggestion => !values.some(value => value.toLowerCase() === suggestion.toLowerCase())
    )

    return (
        <div className="tag-editor">
            <label>{label}</label>

            <div className="tag-editor-selected">
                {values.length === 0 ? (
                    <p className="tag-editor-empty">Ничего не выбрано</p>
                ) : (
                    values.map(value => (
                        <button
                            key={value}
                            type="button"
                            className="tag-chip"
                            onClick={() => removeValue(value)}
                            title="Remove"
                        >
                            <span>{value}</span>
                            <span aria-hidden="true">x</span>
                        </button>
                    ))
                )}
            </div>

            <div className="tag-editor-input-row">
                <input
                    type="text"
                    value={inputValue}
                    placeholder={placeholder}
                    onChange={event => setInputValue(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault()
                            addValue(inputValue)
                        }
                    }}
                />
                <button type="button" onClick={() => addValue(inputValue)}>
                    Добавить
                </button>
            </div>

            {availableSuggestions.length > 0 && (
                <div className="tag-editor-suggestions">
                    {availableSuggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => addValue(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
