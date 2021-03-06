<?php
if ($_GET['email'] != "" && $_COOKIE['email'] == "")
{
$expire=time()+60*60*24*30;
setcookie("email", $_GET["email"], $expire);
}

/* Profiling */
define('REQUEST_START', microtime(true));

/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2008, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

/**
 * OntoWiki bootstrap file.
 *
 * @copyright Copyright (c) 2008, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 * @category OntoWiki
 * @author Norman Heino <norman.heino@gmail.com>
 */

/**
 * Boostrap constants
 * @since 0.9.5
 */
define('BOOTSTRAP_FILE', basename(__FILE__));
define('ONTOWIKI_ROOT', rtrim(dirname(__FILE__), '/\\') . '/');
define('APPLICATION_PATH', ONTOWIKI_ROOT . 'application/');

/**
 * Old constants for < 0.9.5 backward compatibility
 * @deprecated 0.9.5
 */
define('_OWBOOT', BOOTSTRAP_FILE);
define('_OWROOT', ONTOWIKI_ROOT);
define('OW_SHOW_MAX', 10);


// PHP environment settings
ini_set('max_execution_time', 240);

if ((int) substr(ini_get('memory_limit'), 0, -1) < 256) {
    ini_set('memory_limit', '256M');
}

// add libraries to include path
$includePath = get_include_path() . PATH_SEPARATOR;
$includePath .= ONTOWIKI_ROOT . 'libraries/' . PATH_SEPARATOR;
set_include_path($includePath);

// use default timezone from php.ini or let PHP guess it
date_default_timezone_set(@date_default_timezone_get());


// determine wheter rewrite engine works
// and redirect to a URL that doesn't need rewriting
// TODO: check for AllowOverride All
// Use of apache functions is not compatible with Virtuoso VAD
$rewriteEngineOn = false;

if (function_exists('apache_get_modules')) {
    if (in_array('mod_rewrite', apache_get_modules())) {
        // get .htaccess contents
        $htaccess = @file_get_contents(ONTOWIKI_ROOT . '.htaccess');

        // check if RewriteEndine is enabled
        $rewriteEngineOn = preg_match('/.*[^#][\t ]+RewriteEngine[\t ]+On/i', $htaccess);

        // explicitly request /index.php for non-rewritten requests
        if (!$rewriteEngineOn and ! strpos($_SERVER['REQUEST_URI'], BOOTSTRAP_FILE)) {
            header('Location: ' . rtrim($_SERVER['REQUEST_URI'], '/\\') . '/' . BOOTSTRAP_FILE, true, 302);
            exit;
        }
    }
}

define('ONTOWIKI_REWRITE', $rewriteEngineOn);


/**
 * Ensure compatibility for PHP <= 5.3
 */
if (!function_exists('class_alias')) {
    function class_alias($original, $alias) {
        eval('abstract class ' . $alias . ' extends ' . $original . ' {}');
    }
}

/** Zend_Application */
require_once 'Zend/Application.php';

// create application
$application = new Zend_Application(
                'default',
                ONTOWIKI_ROOT . 'application/config/application.ini'
);

/** OntoWiki */
require_once 'OntoWiki.php';

// define alias for backward compatiblity
class_alias('OntoWiki', 'OntoWiki_Application');

// bootstrap and run
$application->bootstrap()
        ->run();
