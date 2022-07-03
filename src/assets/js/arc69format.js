export function FormatJson(title, description, mediaUrl) {
    return {
        "title": title,
        "type": "object",
        "properties": {
            "standard": {
                "type": "string",
                "value": "arc69",
            },
            "description": {
                "type": "string",
                "description": description
            },
            "media_url": {
                "type": "string",
                "description": mediaUrl
            }
        }
    }
}