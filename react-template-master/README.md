# Soul Machines React Template

This React app can be used as a starting point for building your own Digital Person UI.

The app demonstrates how to connect to a Digital Person, speak with them, chat with them by typing, and receive visual content cards from your conversation provider.

## Requirements

- Soul Machines JWT Token Server (express-token-server)
- Webpack
- NPM

## Environment variables

Webpack builds require the following environment variables to be passed in;

- `TOKEN_ISSUER`: The token server endpoint
- `ORCHESTRATION_MODE`: (boolean) When enabled, text input will be sent to the orchestration server instead of directly to the persona.
- `SHOW_CAMERA`: (boolean) Whether to show the user's camera preview when in a video chat session

These can be defined in a `.env` file, or passed in manually;

```bash
webpack --mode production \
    --env.TOKEN_ISSUER=https://localhost:5000/auth/authorize \
    --env.ORCHESTRATION_MODE=true \
    --env.SHOW_CAMERA=true
```

## Development setup

Start your token issuer server (supplied separately by Soul Machines).

Install dependencies;

```bash
npm install
```

Start the development server;

```bash
npm run dev
```

Navigate to https://localhost:8000 to view the application

## Production builds

You can build a production version of the UI by running;

```bash
npm run prod
```

## Context data

Context data can be anything defined by the dialog provider (e.g. Watson or Dialog Flow). Typically JSON data is stored to describe images, video, or other supplimentary text content.

When a `conversationResult` message is received, the `output.context` field may contain any number of context elements which may be referenced in a later message by conversation markers.

The `SoulMachinesProvider::handleConversationResult()` method defines how context data is received and stored in the application, while `SoulMachinesProvider::handleSpeechMarker()` defines how it is retrived and displayed once triggered by a marker. These will likely need to be rewriten depending on the requirements of the application.

The formatting and display of this data is handled by the panel components located in `src/app/components/Panels`.

This demo application expects to receive context data structured as follows;

### Image content
```json
{
    "component": "image",
    "data": {
        "url": "https://example.com/image.jpg",
        "alt": "Image alt text"
    }
}
```

### Video content
```json
{
    "component": "video",
    "data": {
        "url": "https://www.youtube.com/embed/XAwjGwJXyxg"
    }
}
```

### HTML content
```json
{
    "component": "htmlText",
    "data": {
        "html": "Here's some cool HTML content with <b>bold</b> and <i>italics</i>."
    }
}
```

### Conversation options
```json
{
    "component": "options",
    "data": {
        "options": [
            {
                "label": "First Option"
            },
            {
                "label": "Second Option"
            },
            {
                "label": "Third Option"
            }
        ]
    }
}
```

### External Link
```json
{
  "component": "externalLink",
  "data": {
    "url": "https://www.soulmachines.com",
    "imageUrl": "https://www.soulmachines.com/wp-content/themes/soulmachines/images/sm-logo.png",
    "title": "Soul Machines",
    "description": "The world leader in humanizing AI to create astonishing Digital People.",
  }
}
```

- **url:** The web link which should be opened in a new tab when the block is clicked.
- **imageUrl:** _Optional_: The image to be displayed, must use https:// prefix. Supports JPG, SVG, PNG, GIF.
- **title:** _Optional_: Text to display as a heading on the card.
- **description:** _Optional_: Paragraph text to give more information about the link.

### Markdown
```json
{
  "component": "markdown",
  "data": {
    "text": "**Hello** my friends!\n\nHere's a list:\n- one\n- two\n- three"
  }
}
```

- **text:** The JSON-escaped markdown text which should be displayed in the block.

You can read more about Markdown in this [Markdown Guide](https://www.markdownguide.org/cheat-sheet/).  
You can convert a normal piece of text to a JSON-escaped string using the [FreeFormatter](https://www.freeformatter.com/json-escape.html).
