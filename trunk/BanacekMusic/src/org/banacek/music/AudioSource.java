package org.banacek.music;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Map.Entry;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
/**
 * Gets the URLs for the audio sources.
 * <P/>
 * Created on 03 Jun 2010, at 08:44.
 * Project: BanacekMusic.
 * Filename: AudioSource.java.
 * 
 * @author joel
 */
public class AudioSource
{
	/**
     * Logging object.
     */
    private static final Logger LOGGER = Logger.getLogger(AudioSource.class.getName());
    
	/**
	 * The track properties file name.
	 */
	private static final String TRACK_PROPERTIES_FILE_NAME = "tracks.properties";
	
	/**
	 * Number of seconds for which a track URL is valid.
	 */
	private static final int URL_EXPIRY_SECONDS = 3600;
	
	/**
	 * A token to replace for the track name.
	 */
	private static final String TRACK_NAME_TOKEN = "%%TRACK_NAME_TOKEN%%";
	
	/**
	 * The pattern to get hold of the actual track URL within the track home page.
	 */
	private static final String TRACK_URL_PATTERN = ".*selfUrl: '.*?" + TRACK_NAME_TOKEN + "'.*?downloadUrl: '(.*?)\\\\x3fdownload.*";
	
	/**
	 * The track properties.
	 */
	private static final Properties TRACK_PROPERTIES;
	
	/**
	 * A mapping between the track ID -> track pattern.
	 */
	private static final Map<String, Pattern> TRACK_PATTERN = new HashMap<String, Pattern>();
	
	/**
	 * A mapping between track ID -> track URL details.
	 */
	private final MemcacheService trackMap;
	
	/**
	 * Loads the track properties.
	 */
	static
	{
		TRACK_PROPERTIES = new Properties();
        try
        {
        	FileInputStream fis = new FileInputStream("WEB-INF/" + TRACK_PROPERTIES_FILE_NAME);
			TRACK_PROPERTIES.load(fis);
			for (Entry<Object, Object> trackHomeEntry : TRACK_PROPERTIES.entrySet())
			{
				String trackHomeUrlStr = (String)trackHomeEntry.getValue();
				String trackName = trackHomeUrlStr.substring(trackHomeUrlStr.lastIndexOf("music") + 5)
						.replaceAll(":", "\\\\\\\\x3a")
						.replaceAll("/", "\\\\\\\\x2f")
						.replaceAll("%20", "\\\\\\\\x2520")
						.replaceAll("\\.", "\\\\.")
						.replaceAll("\\^", "\\\\\\\\x5e");
				TRACK_PATTERN.put((String)trackHomeEntry.getKey(),
						Pattern.compile(TRACK_URL_PATTERN.replace(TRACK_NAME_TOKEN, trackName), Pattern.MULTILINE | Pattern.DOTALL));
			}
		}
        catch (IOException e)
        {
        	LOGGER.severe("Unable to load track properties.\n" + e.getMessage());
		}
	}
	
	public AudioSource()
	{
		trackMap = MemcacheServiceFactory.getMemcacheService();
	}
	
	/**
	 * Gets the URL for the given track ID.
	 * @param trackId The track ID.
	 * @return The song URL.
	 */
	public String getUrl(String trackId)
	{
		String trackUrl  = (String) trackMap.get(trackId);
		if (trackUrl == null)
		{
			LOGGER.finest("Cache miss, reloading track URL.");
			String trackHomeUrl = TRACK_PROPERTIES.getProperty(trackId);
			Pattern trackUrlPattern = TRACK_PATTERN.get(trackId);
			trackUrl = getTrackUrl(trackHomeUrl, trackUrlPattern);
			if (trackUrl == null)
			{
				return null;
			}
			trackMap.put(trackId, trackUrl, Expiration.byDeltaSeconds(URL_EXPIRY_SECONDS));
		}
		return trackUrl;
	}
	
	/**
	 * Gets the track URL.
	 * @param trackHomeUrl The track home URL.
	 * @param trackUrlPattern The track URL pattern.
	 * @return The track URL.
	 */
	private String getTrackUrl(String trackHomeUrl, Pattern trackUrlPattern)
	{
		String trackUrl = "";
		BufferedReader reader = null;
		StringBuilder trackHome = new StringBuilder();
		try
		{
			URL url = new URL(trackHomeUrl.replaceAll("\\^", "%5E"));
			reader = new BufferedReader(new InputStreamReader(url.openStream(), Charset.forName("UTF8")));
            String line;

            while ((line = reader.readLine()) != null)
            {
            	trackHome.append(line);
            }
            
            Matcher matcher = trackUrlPattern.matcher(trackHome);
    		if (matcher.matches())
    		{
    			trackUrl = matcher.group(1);
    			return trackUrl.replaceAll("\\\\x3a", ":")
	    			.replaceAll("\\\\x2f", "/")
	    			.replaceAll("\\\\x2520", "%20")
	    			.replaceAll("\\\\x27", "'");
    		}
		}
		catch (MalformedURLException e)
		{
			LOGGER.severe("Could not read from the track home URL.\n" + e.getMessage());
		}
		catch (IOException e)
		{
			LOGGER.severe("Could not read from the track home URL.\n" + e.getMessage());
		}
		catch (Exception e)
		{
			LOGGER.severe("Could not read from the track home URL.\n" + e.getMessage());
		}
		finally
		{
			if (reader != null)
			{
				try
				{
					reader.close();
				}
				catch (IOException e)
				{
					LOGGER.info("Could not close connection to track home URL.\n" + e.getMessage());
				}
			}
		}
		
		return null;
	}
}
