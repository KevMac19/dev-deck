import parseCurl from 'parse-curl';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parses a cURL string into a structured object with enhanced support.
 * @param {string} curlString
 * @returns {object} structured data
 */
export const parseCurlCommand = (curlString) => {
  if (!curlString || !curlString.trim()) return null;

  try {
    const normalize = (str) => str.replace(/\\\n/g, ' ').replace(/\s+/g, ' ').trim();
    const cleanCurl = normalize(curlString);

    // Safety check: parse-curl expects a certain format.
    const parsed = parseCurl(cleanCurl);
    if (!parsed) return null;

    let headers = [];
    let auth = { type: 'none', username: '', password: '', token: '' };
    let bodyType = 'raw';
    let flags = { insecure: false, location: false, compressed: false };
    let multipartData = [];

    // Process Headers & Auth
    if (parsed.header) {
      Object.entries(parsed.header).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();

        // Detect Bearer Token
        if (lowerKey === 'authorization' && value.toLowerCase().startsWith('bearer ')) {
          auth.type = 'bearer';
          auth.token = value.substring(7).trim();
          return;
        }

        // Detect Basic Auth in header
        if (lowerKey === 'authorization' && value.toLowerCase().startsWith('basic ')) {
          auth.type = 'basic';
          try {
            const decoded = atob(value.substring(6).trim());
            const [u, p] = decoded.split(':');
            auth.username = u;
            auth.password = p;
          } catch (e) { /* ignore */ }
          return;
        }

        // Detect Content-Type to infer bodyType
        if (lowerKey === 'content-type') {
          if (value.includes('application/json')) bodyType = 'json';
          else if (value.includes('application/x-www-form-urlencoded')) bodyType = 'x-www-form-urlencoded';
          else if (value.includes('multipart/form-data')) bodyType = 'multipart/form-data';
        }

        headers.push({ id: uuidv4(), key, value });
      });
    }

    // Detect Flags
    if (cleanCurl.includes(' -k ') || cleanCurl.includes(' --insecure ')) flags.insecure = true;
    if (cleanCurl.includes(' -L ') || cleanCurl.includes(' --location ')) flags.location = true;
    if (cleanCurl.includes(' --compressed ')) flags.compressed = true;

    // Detect Basic Auth Flag (-u)
    const authMatch = cleanCurl.match(/\s-u\s+['"]?([^:'"\s]+):([^'"\s]+)['"]?/) || cleanCurl.match(/\s--user\s+['"]?([^:'"\s]+):([^'"\s]+)['"]?/);
    if (authMatch) {
      auth.type = 'basic';
      auth.username = authMatch[1];
      auth.password = authMatch[2];
    }

    // Detect Multipart Flags (-F)
    // Custom regex since parse-curl might put these in generic body or ignore
    // Format: -F "key=value" or -F key=@file
    const multipartRegex = /-F\s+['"]?([^=]+)=([^'"\s]+)['"]?/g;
    let mpMatch;
    // We iterate manually over the string to catch multiple -F
    // This is a naive regex approach but sufficient for editor
    while ((mpMatch = multipartRegex.exec(cleanCurl)) !== null) {
      bodyType = 'multipart/form-data';
      multipartData.push({ id: uuidv4(), key: mpMatch[1], value: mpMatch[2] });
    }

    // If parse-curl detected a body but we found multiparts, use multipartData.
    // If parse-curl detected body and no multipart flags, use parsed.body.
    let finalBody = parsed.body || '';

    // Fallback: If parsed.body exists but we want to auto-detect json kv structure later, we can.
    // For now we just store the string.

    return {
      method: (parsed.method || 'GET').toUpperCase(),
      url: parsed.url || '',
      headers,
      body: finalBody,
      auth,
      bodyType,
      flags,
      multipartData
    };
  } catch (error) {
    console.error("Failed to parse cURL:", error);
    return null;
  }
};

/**
 * Generates a cURL string from structured data with enhanced support.
 * @param {object} data - { method, url, headers, body, auth, flags, bodyType, multipartData }
 * @returns {string} cURL command
 */
export const generateCurlCommand = (data) => {
  const { method, url, headers, body, auth, flags, bodyType, multipartData } = data;

  if (!url) return '';

  let curl = `curl -X ${method} "${url}"`;

  // Flags
  if (flags?.insecure) curl += ` -k`;
  if (flags?.location) curl += ` -L`;
  if (flags?.compressed) curl += ` --compressed`;

  // Auth
  if (auth?.type === 'basic' && auth.username) {
    curl += ` \\\n  -u "${auth.username}:${auth.password}"`;
  } else if (auth?.type === 'bearer' && auth.token) {
    curl += ` \\\n  -H "Authorization: Bearer ${auth.token}"`;
  }

  // Headers
  const activeHeaders = [...headers];

  // Auto-add Content-Type if missing and needed
  const hasContentType = activeHeaders.some(h => h.key.toLowerCase() === 'content-type');
  if (!hasContentType) {
    if (bodyType === 'json' && body) {
      curl += ` \\\n  -H "Content-Type: application/json"`;
    } else if (bodyType === 'x-www-form-urlencoded' && body) {
      curl += ` \\\n  -H "Content-Type: application/x-www-form-urlencoded"`;
    }
  }

  activeHeaders.forEach(h => {
    if (h.key && h.value) {
      curl += ` \\\n  -H "${h.key}: ${h.value}"`;
    }
  });

  // Body
  if (bodyType === 'multipart/form-data') {
    if (multipartData && multipartData.length > 0) {
      multipartData.forEach(item => {
        if (item.key && item.value) {
          curl += ` \\\n  -F "${item.key}=${item.value}"`;
        }
      });
    }
  } else if (body) {
    const escapedBody = body.replace(/'/g, "'\\''");

    // Check if we should use -d or --data-urlencode logic?
    // For now stick to simple -d with proper content-type
    curl += ` \\\n  -d '${escapedBody}'`;
  }

  return curl;
};
