/**
 * This command fetches information about a MetaPress-enabled website, and tests to see if it's accessible.
 */
import ora from 'ora'
import { parse } from 'node-html-parser'

// Command info
export const command = 'info <url>'
export const describe = 'Fetch information about a MetaPress-enabled website.'
export const builder = {
    url: {
        describe: 'URL of the website to check',
        type: 'string',
        demandOption: true
    }
}

// Command handler
export const handler = async (argv) => {
    
    // Start spinner
    console.log('')
    let spinner = ora('Checking details...').start()

    // Catch errors
    try {

        // If no URL, add http:// to it
        if (!argv.url.includes('://')) {
            argv.url = 'http://' + argv.url
        }

        // Do a fetch of the page
        let response = await fetch(argv.url)
        let htmlString = await response.text()

        // Parse og tags
        let html = parse(htmlString)

        // Get content of a meta tag
        let getMetaContent = (name) => {
            return (html.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || html.querySelector(`meta[property="${name}"]`)?.getAttribute('content') || '').trim()
        }

        // Resolve full portal URL
        let portalURL = getMetaContent('metaverse:portal.url')
        if (portalURL)
            portalURL = new URL(portalURL, response.url).href
        
        // Check if portal image is CORS-enabled
        let portalImageURL = getMetaContent('metaverse:portal.image')
        let portalImageStatus = ''
        if (portalImageURL) {

            // Make the URL absolute
            portalImageURL = new URL(portalImageURL, response.url).href

            // Catch errors
            try {

                // Fetch the image
                let portalImageRequest = await fetch(portalImageURL, { method: 'GET' })
                if (!portalImageRequest.ok) 
                    throw new Error('Failed to load image')

                // Check if CORS is enabled
                if (!portalImageRequest.headers.get('Access-Control-Allow-Origin'))
                    portalImageStatus = '(CORS error)'

            } catch (err) {

                // Failed to load image
                portalImageStatus = '(failed to load)'

            }

        }
            

        // Success, show information
        spinner.succeed('Completed:')
        console.log('- Title: '                 + (getMetaContent('og:title') || html.querySelector('title').text))
        console.log('- Portal URL: '            + (portalURL || '(none)'))
        console.log('- Portal Image: '          + (portalImageURL ? `${portalImageURL} ${portalImageStatus}` : '(none)'))
        console.log('- Metaverse Provider: '    + (getMetaContent('metaverse:portal.provider') || '(none)'))
        console.log('- Server: '                + (response.headers.get('Server') || '(none)'))
        console.log('- Generator: '             + (getMetaContent('generator') || '(none)'))

    } catch (err) {

        // Failed, stop spinner and show error
        spinner.fail(err.message)

    }

    // Padding
    console.log('')
    
}