PL Contact Form
===============
Contact Form is a script wrapper that recognize an HTMLFormElement and gives it functionality like validation, error handling, events and communication with the server via AJAX.

### Usage
```javascript
let settings = {
    url: 'process-ajax.php',
    useAjax: true
};

let formElement = document.getElementById('form-element');
let form = new pl.ContactForm(formElement, settings);
```

Use `settings` to personalize the contact form instance.

<table>
    <tr>
        <th>Value</th>
        <th>Type</th>
        <th>Default Value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>url</td>
        <td><code>string</code></td>
        <td><code>"process-ajax.php"</code></td>
        <td>Default endpoint that will resolve requests.</td>
    </tr>
    <tr>
        <td>useAjax</td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Determine if the request will use ajax or a typical post or get request.</td>
    </tr>
</table>

Contact Form has three events to notify the current state of the AJAX request.

```javascript
// Notify when form is sending a message.
form.sending.add(() => { /* ... */ });

// Notify if an error occured with the request. 
form.error.add(() => { /* ... */ });

// Notify if the request was successfully resolved.
form.success.add(() => { /* ... */ });
```