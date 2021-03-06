<?php 

/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2008, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

/**
 * OntoWiki main class.
 *
 * Serves as a central registry for storing objects needed througout the application.
 * Prior to 0.9.5, this class was called OntoWiki and was also partly
 * responsible for application bootstrapping. As of 0.9.5, bootstrapping is handled
 * by the Bootstrap class. OntoWiki_Application is aliased to OntoWiki, whereby it is 
 * still usable, but deprecated and will certainly disappea in the next release.
 *
 * @category OntoWiki
 * @copyright Copyright (c) 2008, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 * @author Norman Heino <norman.heino@gmail.com>
 */
class OntoWiki
{
    // ------------------------------------------------------------------------
    // --- Properties
    // ------------------------------------------------------------------------
    
    /**
     * The bootstrap object used during bootstrap.
     * @var Zend_Application_Bootstrap_Bootstrap
     */
    protected $_bootstrap = null;
    
    /** 
     * Array of properties
     * @var array 
     */
    protected $_properties = array();
    
    /**
     * Variables to be autoloaded from the session
     * @var array
     */
    protected $_sessionVars = array();
    
    /** 
     * Singleton instance
     * @var OntoWiki 
     */
    private static $_instance = null;
    
    // ------------------------------------------------------------------------
    // --- Magic Methods
    // ------------------------------------------------------------------------
    
    /**
     * Constructor
     */
    private function __construct()
    {
    }
    
    /**
     * Disallow cloning
     */
    private function __clone()
    {
    }
    
    /**
     * Returns a property value
     *
     * @param string $propertyName
     * @return mixed
     * @since 0.9.5
     */
    public function __get($propertyName)
    {
        // retrieve from session
        if (in_array($propertyName, $this->_sessionVars)) {
            if (isset($this->session->$propertyName)) {
                $this->_properties[$propertyName] = $this->session->$propertyName;
            }
        }
        
        // retrieve bootstrap resource
        $bootstrap = $this->getBootstrap();
        if ($bootstrap and $bootstrap->hasResource($propertyName)) {
            return $bootstrap->getResource($propertyName);
        }
        
        // retrieve locally
        if (isset($this->$propertyName)) {
            return $this->_properties[$propertyName];
        }
    }
    
    /**
     * Sets a property
     *
     * @param string $propertyName
     * @param mixed $propertyValue
     * @since 0.9.5
     */
    public function __set($propertyName, $propertyValue)
    {
        // set in session
        if (in_array($propertyName, $this->_sessionVars)) {
            $this->session->$propertyName = $propertyValue;
        }
        
        // set locally
        $this->_properties[$propertyName] = $propertyValue;
    }
    
    /**
     * Returns whether a property is set
     *
     * @param string $propertyName
     * @return boolean
     * @since 0.9.5
     */
    public function __isset($propertyName)
    {
        return array_key_exists($propertyName, $this->_properties);
    }
    
    /**
     * Unsets a property
     *
     * @param string $propertyName
     * @since 0.9.5
     */
    public function __unset($propertyName)
    {
        // unset from session
        if (in_array($propertyName, $this->_sessionVars)) {
            unset($this->session->$propertyName);
        }
        
        // unset locally
        unset($this->_properties[$propertyName]);
    }
    
    // ------------------------------------------------------------------------
    // --- Public Methods
    // ------------------------------------------------------------------------ 
    
    /**
     * Appends a message to the message stack
     *
     * @param OntoWiki_Message $message The message to be added.
     * @return OntoWiki
     */
    public function appendMessage(OntoWiki_Message $message)
    {
        $session = $this->getBootstrap()->getResource('Session');
        
        $messageStack = (array)$session->messageStack;
        array_push($messageStack, $message);
        
        $session->messageStack = $messageStack;
        
        return $this;
    }
    
    /**
     * Returns the current message stack and empties it.
     *
     * @since 0.9.5
     * @return array
     */
    public function drawMessages()
    {
        return $this->getMessages(true);
    }
    
    /**
     * Returns the application bootstrap object
     *
     * @since 0.9.5
     */
    public function getBootstrap()
    {
        if (null === $this->_bootstrap) {
            $frontController  = Zend_Controller_Front::getInstance();
            $this->_bootstrap = $frontController->getParam('bootstrap');
        }
        
        return $this->_bootstrap;
    }
    
    /**
     * Returns the system config object
     *
     * @since 0.9.5
     * @return Zend_Config
     */
    public function getConfig()
    {
        $bootstrap = $this->getBootstrap();
        if ($bootstrap and $bootstrap->hasResource('Config')) {
            return $this->getBootstrap()->getResource('Config');
        }
    }
    
    /**
     * Singleton instance
     *
     * @return OntoWiki
     */
    public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        
        return self::$_instance;
    }
    
    /**
     * Returns the current message stack and empties it.
     *
     * @param boolean $clearMessages Clears the message stack after retrieval
     * @return array
     */
    public function getMessages($clearMessages = false)
    {
        $session = $this->getBootstrap()->getResource('Session');
        
        // store temporarily
        $messageStack = (array)$this->session->messageStack;
        
        if ($clearMessages) {
            // empty message stack
            unset($session->messageStack);
        }
        
        // return temp
        return $messageStack;
    }
    
    /**
     * Returns the base URL for static files.
     * In case mod_rewrite is enabled, getUrlBase and getStaticUrlBase
     * return identical results.
     *
     * @since 0.9.5
     * @return string
     */
    public function getStaticUrlBase()
    {
        if ($config = $this->getConfig()) {
            return $config->staticUrlBase;
        }
    }
    
    /**
     * Returns the base URL for dynamic requests.
     * In case mod_rewrite is enabled, getUrlBase and getStaticUrlBase
     * return identical results.
     *
     * @since 0.9.5
     * @return string
     */
    public function getUrlBase()
    {
        if ($config = $this->getConfig()) {
            return $config->urlBase;
        }
    }
    
    /**
     * Returns the currently logged-in user.
     *
     * @return Erfurt_Auth_Identity
     */
    public function getUser()
    {
        return $this->user;
    }
    
    /**
     * Returns whether OntoWiki currently has messages for the user.
     *
     * @return boolean
     */
    public function hasMessages()
    {
        $messages = $this->getMessages();
        
        return (!empty($messages));
    }
    
    /**
     * Sets an array of variables that are to be synchronized
     * with the session.
     *
     * @since 0.9.5
     * @param array $sessionVars
     */
    public function setSessionVars(array $sessionVars)
    {
        // add to session vars
        $this->_sessionVars = $sessionVars;
    }
    
    /**
     * Prepends a message to the message stack
     *
     * @param OntoWiki_Message $message The message to be added.
     * @return OntoWiki
     */
    public function prependMessage(OntoWiki_Message $message)
    {
        $session = $this->getBootstrap()->getResource('Session');
        
        $messageStack = (array)$session->messageStack;
        array_unshift($messageStack, $message);
        
        $session->messageStack = $messageStack;
        
        return $this;
    }
}

