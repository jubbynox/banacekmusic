package org.banacek.music.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.banacek.music.AudioSource;

/**
 * Servlet to startup.
 * <P/>
 * Created on 07 Jun 2010, at 08:33.
 * Project: BanacekMusic.
 * Filename: GetTrackUrl.java.
 * 
 * @author joel
 */
public class GetTrackUrl extends HttpServlet
{
	/**
	 * The serial version UID.
	 */
	private static final long serialVersionUID = -2939511371282451404L;
	
	/**
	 * The track parameter.
	 */
	private static final String TRACK_PARAM = "trackId";
	
	/**
	 * The location HTTP response header field name.
	 */
	private static final String LOCATION_FIELD = "location";
	
	/**
	 * The audio source.
	 */
	private static final AudioSource audioSource = new AudioSource();

	/**
	 * {@inheritDoc}
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
	{
		String url = audioSource.getUrl(req.getParameter(TRACK_PARAM));
		if (url == null)
		{
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		else
		{
			resp.setStatus(HttpServletResponse.SC_FOUND);
			resp.setHeader(LOCATION_FIELD, audioSource.getUrl(req.getParameter(TRACK_PARAM)));
		}
	}
}
