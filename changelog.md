# Assessment module version changelog
Given a version number MAJOR.MINOR.PATCH:

- MAJOR version MUST be incremented if any backwards incompatible changes are introduced. It MAY include minor and patch level changes. 
- MINOR version MUST be incremented if new, backwards compatible functionality is introduced to the public API. It MUST be incremented if any public API functionality is marked as deprecated. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes.
- PATCH version MUST be incremented if only backwards compatible bug fixes are introduced. A bug fix is defined as an internal change that fixes incorrect behaviour.

## Version 1.1.0 (2018-06-08)

 - Issue 384: assessment data object encrypted in database

## Version 1.0.0 (2018-06-08)
Despite MHEP has being fully functional for some years now I am calling it, at this stage, version 1.0.0 because we need a starting point.
Recently MHEP was added to emoncms.org as an extra module. This has made the need of versioning more relevant as sometimes some backwards-incompatible functinality is added. Because we don't want to make anybody's work harder we now have versions :)