# The Atom Syndication Format (RFC 4287)

- **Network Working Group**
- **Request for Comments:** 4287
- **Category:** Standards Track
- **Editors:** M. Nottingham, R. Sayre
- **Date:** December 2005

## Status of This Memo

This document specifies an Internet standards track protocol for the Internet community, and requests discussion and suggestions for improvements. Please refer to the current edition of the "Internet Official Protocol Standards" (STD 1) for the standardization state and status of this protocol. Distribution of this memo is unlimited.

## Copyright Notice

Copyright (C) The Internet Society (2005).

## Abstract

This document specifies Atom, an XML-based Web content and metadata syndication format.

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1. Examples](#11-examples)
  - [1.2. Namespace and Version](#12-namespace-and-version)
  - [1.3. Notational Conventions](#13-notational-conventions)
- [2. Atom Documents](#2-atom-documents)
- [3. Common Atom Constructs](#3-common-atom-constructs)
  - [3.1. Text Constructs](#31-text-constructs)
  - [3.2. Person Constructs](#32-person-constructs)
  - [3.3. Date Constructs](#33-date-constructs)
- [4. Atom Element Definitions](#4-atom-element-definitions)
  - [4.1. Container Elements](#41-container-elements)
  - [4.2. Metadata Elements](#42-metadata-elements)
- [5. Securing Atom Documents](#5-securing-atom-documents)
- [6. Extending Atom](#6-extending-atom)
- [7. IANA Considerations](#7-iana-considerations)
- [8. Security Considerations](#8-security-considerations)
- [9. References](#9-references)
- [Appendix A. Contributors](#appendix-a-contributors)
- [Appendix B. RELAX NG Compact Schema](#appendix-b-relax-ng-compact-schema)

## 1. Introduction

Atom is an XML-based document format that describes lists of related information known as "feeds". Feeds are composed of a number of items, known as "entries", each with an extensible set of attached metadata. For example, each entry has a title.

The primary use case that Atom addresses is the syndication of Web content such as weblogs and news headlines to Web sites as well as directly to user agents.

### 1.1. Examples

A brief, single-entry Atom Feed Document:

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">

  <title>Example Feed</title>
  <link href="http://example.org/"/>
  <updated>2003-12-13T18:30:02Z</updated>
  <author>
    <name>John Doe</name>
  </author>
  <id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>

  <entry>
    <title>Atom-Powered Robots Run Amok</title>
    <link href="http://example.org/2003/12/13/atom03"/>
    <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
    <updated>2003-12-13T18:30:02Z</updated>
    <summary>Some text.</summary>
  </entry>

</feed>
```

A more extensive, single-entry Atom Feed Document:

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">dive into mark</title>
  <subtitle type="html">
    A &lt;em&gt;lot&lt;/em&gt; of effort
    went into making this effortless
  </subtitle>
  <updated>2005-07-31T12:29:29Z</updated>
  <id>tag:example.org,2003:3</id>
  <link rel="alternate" type="text/html"
   hreflang="en" href="http://example.org/"/>
  <link rel="self" type="application/atom+xml"
   href="http://example.org/feed.atom"/>
  <rights>Copyright (c) 2003, Mark Pilgrim</rights>
  <generator uri="http://www.example.com/" version="1.0">
    Example Toolkit
  </generator>
  <entry>
    <title>Atom draft-07 snapshot</title>
    <link rel="alternate" type="text/html"
     href="http://example.org/2005/04/02/atom"/>
    <link rel="enclosure" type="audio/mpeg" length="1337"
     href="http://example.org/audio/ph34r_my_podcast.mp3"/>
    <id>tag:example.org,2003:3.2397</id>
    <updated>2005-07-31T12:29:29Z</updated>
    <published>2003-12-13T08:29:29-04:00</published>
    <author>
      <name>Mark Pilgrim</name>
      <uri>http://example.org/</uri>
      <email>f8dy@example.com</email>
    </author>
    <contributor>
      <name>Sam Ruby</name>
    </contributor>
    <contributor>
      <name>Joe Gregorio</name>
    </contributor>
    <content type="xhtml" xml:lang="en"
     xml:base="http://diveintomark.org/">
      <div xmlns="http://www.w3.org/1999/xhtml">
        <p><i>[Update: The Atom draft is finished.]</i></p>
      </div>
    </content>
  </entry>
</feed>
```

### 1.2. Namespace and Version

The XML Namespaces URI for the XML data format described in this specification is:

```
http://www.w3.org/2005/Atom
```

For convenience, this data format may be referred to as "Atom 1.0". This specification uses "Atom" internally.

### 1.3. Notational Conventions

This specification describes conformance in terms of two artifacts: Atom Feed Documents and Atom Entry Documents. Additionally, it places some requirements on Atom Processors.

This specification uses the namespace prefix `atom:` for the Namespace URI identified in Section 1.2, above. Note that the choice of namespace prefix is arbitrary and not semantically significant.

Some sections of this specification are illustrated with fragments of a non-normative RELAX NG Compact schema. However, the text of this specification provides the definition of conformance. A complete schema appears in [Appendix B](#appendix-b-relax-ng-compact-schema).

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14, RFC 2119.

## 2. Atom Documents

This specification describes two kinds of Atom Documents: Atom Feed Documents and Atom Entry Documents.

- An **Atom Feed Document** is a representation of an Atom feed, including metadata about the feed, and some or all of the entries associated with it. Its root is the `atom:feed` element.
- An **Atom Entry Document** represents exactly one Atom entry, outside of the context of an Atom feed. Its root is the `atom:entry` element.

```
namespace atom = "http://www.w3.org/2005/Atom"
start = atomFeed | atomEntry
```

Both kinds of Atom Documents are specified in terms of the XML Information Set, serialized as XML 1.0 and identified with the `application/atom+xml` media type. Atom Documents MUST be well-formed XML. This specification does not define a DTD for Atom Documents, and hence does not require them to be valid (in the sense used by XML).

Atom allows the use of IRIs [RFC3987]. Every URI [RFC3986] is also an IRI, so a URI may be used wherever an IRI is named. There are two special considerations:

1. When an IRI that is not also a URI is given for dereferencing, it MUST be mapped to a URI using the steps in Section 3.1 of RFC 3987.
2. When an IRI is serving as an `atom:id` value, it MUST NOT be so mapped, so that the comparison works as described in Section 4.2.6.1.

Any element defined by this specification MAY have an `xml:base` attribute, establishing the base URI (or IRI) for resolving any relative references found within the effective scope of the `xml:base` attribute.

Any element defined by this specification MAY have an `xml:lang` attribute, whose content indicates the natural language for the element and its descendants. The language context is only significant for elements and attributes declared to be "Language-Sensitive" by this specification.

```
atomCommonAttributes =
   attribute xml:base { atomUri }?,
   attribute xml:lang { atomLanguageTag }?,
   undefinedAttribute*
```

Atom is an extensible format. See [Section 6](#6-extending-atom) for a full description of how Atom Documents can be extended.

## 3. Common Atom Constructs

Many of Atom's elements share a few common structures. This section defines those structures and their requirements for convenient reference by the appropriate element definitions.

> **Note:** There MUST NOT be any white space in a Date construct or in any IRI. Some XML-emitting implementations erroneously insert white space around values by default, and such implementations will emit invalid Atom Documents.

### 3.1. Text Constructs

A Text construct contains human-readable text, usually in small quantities. The content of Text constructs is Language-Sensitive.

```
atomPlainTextConstruct =
   atomCommonAttributes,
   attribute type { "text" | "html" }?,
   text

atomXHTMLTextConstruct =
   atomCommonAttributes,
   attribute type { "xhtml" },
   xhtmlDiv

atomTextConstruct = atomPlainTextConstruct | atomXHTMLTextConstruct
```

#### 3.1.1. The "type" Attribute

Text constructs MAY have a `type` attribute. When present, the value MUST be one of `"text"`, `"html"`, or `"xhtml"`. If the `type` attribute is not provided, Atom Processors MUST behave as though it were present with a value of `"text"`. MIME media types MUST NOT be used as values for the `type` attribute on Text constructs.

##### 3.1.1.1. Text

Example `atom:title` with text content:

```xml
<title type="text">
  Less: &lt;
</title>
```

If the value is `"text"`, the content of the Text construct MUST NOT contain child elements. Such text is intended to be presented to humans in a readable fashion. Atom Processors MAY collapse white space (including line breaks) and display the text using typographic techniques such as justification and proportional fonts.

##### 3.1.1.2. HTML

Example `atom:title` with HTML content:

```xml
<title type="html">
  Less: &lt;em> &amp;lt; &lt;/em>
</title>
```

If the value of `type` is `"html"`, the content of the Text construct MUST NOT contain child elements and SHOULD be suitable for handling as HTML. Any markup within MUST be escaped; for example, `"<br>"` as `"&lt;br>"`. HTML markup within SHOULD be such that it could validly appear directly within an HTML `<DIV>` element, after unescaping.

##### 3.1.1.3. XHTML

Example `atom:title` with XHTML content:

```xml
<title type="xhtml" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xhtml:div>
    Less: <xhtml:em> &lt; </xhtml:em>
  </xhtml:div>
</title>
```

If the value of `type` is `"xhtml"`, the content of the Text construct MUST be a single XHTML div element and SHOULD be suitable for handling as XHTML. The XHTML div element itself MUST NOT be considered part of the content.

### 3.2. Person Constructs

A Person construct is an element that describes a person, corporation, or similar entity (hereafter, 'person').

```
atomPersonConstruct =
   atomCommonAttributes,
   (element atom:name { text }
    & element atom:uri { atomUri }?
    & element atom:email { atomEmailAddress }?
    & extensionElement*)
```

This specification assigns no significance to the order of appearance of the child elements in a Person construct. Person constructs allow extension Metadata elements (see Section 6.4).

#### 3.2.1. The "atom:name" Element

The `atom:name` element's content conveys a human-readable name for the person. The content of `atom:name` is Language-Sensitive. Person constructs MUST contain exactly one `atom:name` element.

#### 3.2.2. The "atom:uri" Element

The `atom:uri` element's content conveys an IRI associated with the person. Person constructs MAY contain an `atom:uri` element, but MUST NOT contain more than one. The content of `atom:uri` in a Person construct MUST be an IRI reference [RFC3987].

#### 3.2.3. The "atom:email" Element

The `atom:email` element's content conveys an e-mail address associated with the person. Person constructs MAY contain an `atom:email` element, but MUST NOT contain more than one. Its content MUST conform to the `addr-spec` production in RFC 2822.

### 3.3. Date Constructs

A Date construct is an element whose content MUST conform to the `date-time` production in RFC 3339. In addition, an uppercase `T` character MUST be used to separate date and time, and an uppercase `Z` character MUST be present in the absence of a numeric time zone offset.

```
atomDateConstruct =
   atomCommonAttributes,
   xsd:dateTime
```

Such date values are compatible with: ISO 8601, W3C Date and Time Formats, and XML Schema Part 2: Datatypes.

Example Date constructs:

```xml
<updated>2003-12-13T18:30:02Z</updated>
<updated>2003-12-13T18:30:02.25Z</updated>
<updated>2003-12-13T18:30:02+01:00</updated>
<updated>2003-12-13T18:30:02.25+01:00</updated>
```

Date values SHOULD be as accurate as possible.

## 4. Atom Element Definitions

### 4.1. Container Elements

#### 4.1.1. The "atom:feed" Element

The `atom:feed` element is the document (i.e., top-level) element of an Atom Feed Document, acting as a container for metadata and data associated with the feed. Its element children consist of metadata elements followed by zero or more `atom:entry` child elements.

```
atomFeed =
   element atom:feed {
      atomCommonAttributes,
      (atomAuthor*
       & atomCategory*
       & atomContributor*
       & atomGenerator?
       & atomIcon?
       & atomId
       & atomLink*
       & atomLogo?
       & atomRights?
       & atomSubtitle?
       & atomTitle
       & atomUpdated
       & extensionElement*),
      atomEntry*
   }
```

This specification assigns no significance to the order of `atom:entry` elements within the feed.

The following child elements are defined by this specification (note that the presence of some of these elements is required):

- `atom:feed` elements MUST contain one or more `atom:author` elements, unless all of the `atom:feed` element's child `atom:entry` elements contain at least one `atom:author` element.
- `atom:feed` elements MAY contain any number of `atom:category` elements.
- `atom:feed` elements MAY contain any number of `atom:contributor` elements.
- `atom:feed` elements MUST NOT contain more than one `atom:generator` element.
- `atom:feed` elements MUST NOT contain more than one `atom:icon` element.
- `atom:feed` elements MUST NOT contain more than one `atom:logo` element.
- `atom:feed` elements MUST contain exactly one `atom:id` element.
- `atom:feed` elements SHOULD contain one `atom:link` element with a `rel` attribute value of `"self"`. This is the preferred URI for retrieving Atom Feed Documents representing this Atom feed.
- `atom:feed` elements MUST NOT contain more than one `atom:link` element with a `rel` attribute value of `"alternate"` that has the same combination of `type` and `hreflang` attribute values.
- `atom:feed` elements MAY contain additional `atom:link` elements beyond those described above.
- `atom:feed` elements MUST NOT contain more than one `atom:rights` element.
- `atom:feed` elements MUST NOT contain more than one `atom:subtitle` element.
- `atom:feed` elements MUST contain exactly one `atom:title` element.
- `atom:feed` elements MUST contain exactly one `atom:updated` element.

If multiple `atom:entry` elements with the same `atom:id` value appear in an Atom Feed Document, they represent the same entry. Their `atom:updated` timestamps SHOULD be different.

##### 4.1.1.1. Providing Textual Content

It is advisable that each `atom:entry` element contain a non-empty `atom:title` element, a non-empty `atom:content` element when that element is present, and a non-empty `atom:summary` element when the entry contains no `atom:content` element. However, the absence of `atom:summary` is not an error, and Atom Processors MUST NOT fail to function correctly as a consequence of such an absence.

#### 4.1.2. The "atom:entry" Element

The `atom:entry` element represents an individual entry, acting as a container for metadata and data associated with the entry. This element can appear as a child of the `atom:feed` element, or it can appear as the document (i.e., top-level) element of a stand-alone Atom Entry Document.

```
atomEntry =
   element atom:entry {
      atomCommonAttributes,
      (atomAuthor*
       & atomCategory*
       & atomContent?
       & atomContributor*
       & atomId
       & atomLink*
       & atomPublished?
       & atomRights?
       & atomSource?
       & atomSummary?
       & atomTitle
       & atomUpdated
       & extensionElement*)
   }
```

The following child elements are defined by this specification:

- `atom:entry` elements MUST contain one or more `atom:author` elements, unless the `atom:entry` contains an `atom:source` element that contains an `atom:author` element or, in an Atom Feed Document, the `atom:feed` element contains an `atom:author` element itself.
- `atom:entry` elements MAY contain any number of `atom:category` elements.
- `atom:entry` elements MUST NOT contain more than one `atom:content` element.
- `atom:entry` elements MAY contain any number of `atom:contributor` elements.
- `atom:entry` elements MUST contain exactly one `atom:id` element.
- `atom:entry` elements that contain no child `atom:content` element MUST contain at least one `atom:link` element with a `rel` attribute value of `"alternate"`.
- `atom:entry` elements MUST NOT contain more than one `atom:link` element with a `rel` attribute value of `"alternate"` that has the same combination of `type` and `hreflang` attribute values.
- `atom:entry` elements MAY contain additional `atom:link` elements beyond those described above.
- `atom:entry` elements MUST NOT contain more than one `atom:published` element.
- `atom:entry` elements MUST NOT contain more than one `atom:rights` element.
- `atom:entry` elements MUST NOT contain more than one `atom:source` element.
- `atom:entry` elements MUST contain an `atom:summary` element in either of the following cases:
  - the `atom:entry` contains an `atom:content` that has a `src` attribute (and is thus empty).
  - the `atom:entry` contains content that is encoded in Base64; i.e., the `type` attribute of `atom:content` is a MIME media type, but is not an XML media type, does not begin with `text/`, and does not end with `/xml` or `+xml`.
- `atom:entry` elements MUST NOT contain more than one `atom:summary` element.
- `atom:entry` elements MUST contain exactly one `atom:title` element.
- `atom:entry` elements MUST contain exactly one `atom:updated` element.

#### 4.1.3. The "atom:content" Element

The `atom:content` element either contains or links to the content of the entry. The content of `atom:content` is Language-Sensitive.

```
atomInlineTextContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { "text" | "html" }?,
      (text)*
   }

atomInlineXHTMLContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { "xhtml" },
      xhtmlDiv
   }

atomInlineOtherContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { atomMediaType }?,
      (text|anyElement)*
   }

atomOutOfLineContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { atomMediaType }?,
      attribute src { atomUri },
      empty
   }

atomContent = atomInlineTextContent
 | atomInlineXHTMLContent
 | atomInlineOtherContent
 | atomOutOfLineContent
```

##### 4.1.3.1. The "type" Attribute

On the `atom:content` element, the value of the `type` attribute MAY be one of `"text"`, `"html"`, or `"xhtml"`. Failing that, it MUST conform to the syntax of a MIME media type, but MUST NOT be a composite type. If neither the `type` attribute nor the `src` attribute is provided, Atom Processors MUST behave as though the `type` attribute were present with a value of `"text"`.

##### 4.1.3.2. The "src" Attribute

`atom:content` MAY have a `src` attribute, whose value MUST be an IRI reference [RFC3987]. If the `src` attribute is present, `atom:content` MUST be empty. Atom Processors MAY use the IRI to retrieve the content and MAY choose to ignore remote content or to present it in a different manner than local content.

If the `src` attribute is present, the `type` attribute SHOULD be provided and MUST be a MIME media type, rather than `"text"`, `"html"`, or `"xhtml"`.

##### 4.1.3.3. Processing Model

Atom Documents MUST conform to the following rules. Atom Processors MUST interpret `atom:content` according to the first applicable rule.

1. If the value of `type` is `"text"`, the content of `atom:content` MUST NOT contain child elements. Such text is intended to be presented to humans in a readable fashion.
2. If the value of `type` is `"html"`, the content of `atom:content` MUST NOT contain child elements and SHOULD be suitable for handling as HTML. The HTML markup MUST be escaped; for example, `"<br>"` as `"&lt;br>"`.
3. If the value of `type` is `"xhtml"`, the content of `atom:content` MUST be a single XHTML div element and SHOULD be suitable for handling as XHTML. The XHTML div element itself MUST NOT be considered part of the content.
4. If the value of `type` is an XML media type or ends with `+xml` or `/xml` (case insensitive), the content of `atom:content` MAY include child elements and SHOULD be suitable for handling as the indicated media type.
5. If the value of `type` begins with `text/` (case insensitive), the content of `atom:content` MUST NOT contain child elements.
6. For all other values of `type`, the content of `atom:content` MUST be a valid Base64 encoding, as described in RFC 3548, section 3.

##### 4.1.3.4. Examples

XHTML inline:

```xml
<content type="xhtml">
   <div xmlns="http://www.w3.org/1999/xhtml">
      This is <b>XHTML</b> content.
   </div>
</content>
```

### 4.2. Metadata Elements

#### 4.2.1. The "atom:author" Element

The `atom:author` element is a Person construct that indicates the author of the entry or feed.

```
atomAuthor = element atom:author { atomPersonConstruct }
```

If an `atom:entry` element does not contain `atom:author` elements, then the `atom:author` elements of the contained `atom:source` element are considered to apply. In an Atom Feed Document, the `atom:author` elements of the containing `atom:feed` element are considered to apply to the entry if there are no `atom:author` elements in the locations described above.

#### 4.2.2. The "atom:category" Element

The `atom:category` element conveys information about a category associated with an entry or feed.

```
atomCategory =
   element atom:category {
      atomCommonAttributes,
      attribute term { text },
      attribute scheme { atomUri }?,
      attribute label { text }?,
      undefinedContent
   }
```

- **`term` attribute** (REQUIRED): A string that identifies the category to which the entry or feed belongs.
- **`scheme` attribute** (OPTIONAL): An IRI that identifies a categorization scheme.
- **`label` attribute** (OPTIONAL): Provides a human-readable label for display in end-user applications. The content is Language-Sensitive.

#### 4.2.3. The "atom:contributor" Element

The `atom:contributor` element is a Person construct that indicates a person or other entity who contributed to the entry or feed.

```
atomContributor = element atom:contributor { atomPersonConstruct }
```

#### 4.2.4. The "atom:generator" Element

The `atom:generator` element's content identifies the agent used to generate a feed, for debugging and other purposes.

```
atomGenerator = element atom:generator {
   atomCommonAttributes,
   attribute uri { atomUri }?,
   attribute version { text }?,
   text
}
```

The content of this element, when present, MUST be a string that is a human-readable name for the generating agent.

- The `atom:generator` element MAY have a `uri` attribute whose value MUST be an IRI reference. When dereferenced, the resulting URI SHOULD produce a representation that is relevant to that agent.
- The `atom:generator` element MAY have a `version` attribute that indicates the version of the generating agent.

#### 4.2.5. The "atom:icon" Element

The `atom:icon` element's content is an IRI reference that identifies an image that provides iconic visual identification for a feed.

```
atomIcon = element atom:icon {
   atomCommonAttributes,
   (atomUri)
}
```

The image SHOULD have an aspect ratio of 1:1 (horizontal to vertical) and SHOULD be suitable for presentation at a small size.

#### 4.2.6. The "atom:id" Element

The `atom:id` element conveys a permanent, universally unique identifier for an entry or feed.

```
atomId = element atom:id {
   atomCommonAttributes,
   (atomUri)
}
```

Its content MUST be an IRI, as defined by RFC 3987. Note that the definition of "IRI" excludes relative references. Though the IRI might use a dereferenceable scheme, Atom Processors MUST NOT assume it can be dereferenced.

When an Atom Document is relocated, migrated, syndicated, republished, exported, or imported, the content of its `atom:id` element MUST NOT change. The content of an `atom:id` element MUST be created in a way that assures uniqueness.

##### 4.2.6.1. Comparing atom:id

Instances of `atom:id` elements can be compared to determine whether an entry or feed is the same as one seen before. Processors MUST compare `atom:id` elements on a character-by-character basis (in a case-sensitive fashion). Comparison operations MUST be based solely on the IRI character strings and MUST NOT rely on dereferencing the IRIs or URIs mapped from them.

For example, these are four **distinct** identifiers:

```
http://www.example.org/thing
http://www.example.org/Thing
http://www.EXAMPLE.org/thing
HTTP://www.example.org/thing
```

Likewise, these are three **distinct** identifiers, because IRI %-escaping is significant:

```
http://www.example.com/~bob
http://www.example.com/%7ebob
http://www.example.com/%7Ebob
```

#### 4.2.7. The "atom:link" Element

The `atom:link` element defines a reference from an entry or feed to a Web resource.

```
atomLink =
   element atom:link {
      atomCommonAttributes,
      attribute href { atomUri },
      attribute rel { atomNCName | atomUri }?,
      attribute type { atomMediaType }?,
      attribute hreflang { atomLanguageTag }?,
      attribute title { text }?,
      attribute length { text }?,
      undefinedContent
   }
```

##### 4.2.7.1. The "href" Attribute

The `href` attribute contains the link's IRI. `atom:link` elements MUST have an `href` attribute, whose value MUST be an IRI reference.

##### 4.2.7.2. The "rel" Attribute

`atom:link` elements MAY have a `rel` attribute that indicates the link relation type. If the `rel` attribute is not present, the link element MUST be interpreted as if the link relation type is `"alternate"`.

This document defines five initial values for the Registry of Link Relations:

1. **`alternate`** — Identifies an alternate version of the resource described by the containing element.
2. **`related`** — Identifies a resource related to the resource described by the containing element.
3. **`self`** — Identifies a resource equivalent to the containing element.
4. **`enclosure`** — Identifies a related resource that is potentially large in size and might require special handling. The `length` attribute SHOULD be provided.
5. **`via`** — Identifies a resource that is the source of the information provided in the containing element.

##### 4.2.7.3. The "type" Attribute

On the link element, the `type` attribute's value is an advisory media type: it is a hint about the type of the representation that is expected to be returned when the value of the `href` attribute is dereferenced. Link elements MAY have a `type` attribute, whose value MUST conform to the syntax of a MIME media type.

##### 4.2.7.4. The "hreflang" Attribute

The `hreflang` attribute's content describes the language of the resource pointed to by the `href` attribute. When used together with `rel="alternate"`, it implies a translated version of the entry. Link elements MAY have an `hreflang` attribute, whose value MUST be a language tag [RFC3066].

##### 4.2.7.5. The "title" Attribute

The `title` attribute conveys human-readable information about the link. The content is Language-Sensitive. Link elements MAY have a `title` attribute.

##### 4.2.7.6. The "length" Attribute

The `length` attribute indicates an advisory length of the linked content in octets. Link elements MAY have a `length` attribute.

#### 4.2.8. The "atom:logo" Element

The `atom:logo` element's content is an IRI reference that identifies an image that provides visual identification for a feed.

```
atomLogo = element atom:logo {
   atomCommonAttributes,
   (atomUri)
}
```

The image SHOULD have an aspect ratio of 2:1 (horizontal to vertical).

#### 4.2.9. The "atom:published" Element

The `atom:published` element is a Date construct indicating an instant in time associated with an event early in the life cycle of the entry.

```
atomPublished = element atom:published { atomDateConstruct }
```

Typically, `atom:published` will be associated with the initial creation or first availability of the resource.

#### 4.2.10. The "atom:rights" Element

The `atom:rights` element is a Text construct that conveys information about rights held in and over an entry or feed.

```
atomRights = element atom:rights { atomTextConstruct }
```

The `atom:rights` element SHOULD NOT be used to convey machine-readable licensing information. If an `atom:entry` element does not contain an `atom:rights` element, then the `atom:rights` element of the containing `atom:feed` element, if present, is considered to apply to the entry.

#### 4.2.11. The "atom:source" Element

If an `atom:entry` is copied from one feed into another feed, then the source `atom:feed`'s metadata MAY be preserved within the copied entry by adding an `atom:source` child element.

```
atomSource =
   element atom:source {
      atomCommonAttributes,
      (atomAuthor*
       & atomCategory*
       & atomContributor*
       & atomGenerator?
       & atomIcon?
       & atomId?
       & atomLink*
       & atomLogo?
       & atomRights?
       & atomSubtitle?
       & atomTitle?
       & atomUpdated?
       & extensionElement*)
   }
```

Atom Processors that are performing aggregation SHOULD include at least the required feed-level Metadata elements (`atom:id`, `atom:title`, and `atom:updated`) in the `atom:source` element.

#### 4.2.12. The "atom:subtitle" Element

The `atom:subtitle` element is a Text construct that conveys a human-readable description or subtitle for a feed.

```
atomSubtitle = element atom:subtitle { atomTextConstruct }
```

#### 4.2.13. The "atom:summary" Element

The `atom:summary` element is a Text construct that conveys a short summary, abstract, or excerpt of an entry.

```
atomSummary = element atom:summary { atomTextConstruct }
```

It is not advisable for the `atom:summary` element to duplicate `atom:title` or `atom:content`.

#### 4.2.14. The "atom:title" Element

The `atom:title` element is a Text construct that conveys a human-readable title for an entry or feed.

```
atomTitle = element atom:title { atomTextConstruct }
```

#### 4.2.15. The "atom:updated" Element

The `atom:updated` element is a Date construct indicating the most recent instant in time when an entry or feed was modified in a way the publisher considers significant. Not all modifications necessarily result in a changed `atom:updated` value.

```
atomUpdated = element atom:updated { atomDateConstruct }
```

## 5. Securing Atom Documents

Because Atom is an XML-based format, existing XML security mechanisms can be used to secure its content.

### 5.1. Digital Signatures

The root of an Atom Document (i.e., `atom:feed` in an Atom Feed Document, `atom:entry` in an Atom Entry Document) or any `atom:entry` element MAY have an Enveloped Signature, as described by XML-Signature and Syntax Processing.

Atom Processors MUST NOT reject an Atom Document containing such a signature because they are not capable of verifying it; they MUST continue processing and MAY inform the user of their failure to validate the signature.

Atom Processors that verify signed Atom Documents MUST be able to canonicalize with the exclusive XML canonicalization method identified by the URI `http://www.w3.org/2001/10/xml-exc-c14n#`.

Atom Processors that verify signed Atom Documents MUST be able to verify RSA signatures, but do not need be able to verify DSA signatures. Atom Documents SHOULD NOT use MACs for signatures.

### 5.2. Encryption

The root of an Atom Document MAY be encrypted, using the mechanisms described by XML Encryption Syntax and Processing.

Atom Processors that decrypt Atom Documents MUST be able to decrypt with AES-128 in Cipher Block Chaining (CBC) mode.

Atom Processors that decrypt Atom Documents SHOULD check the integrity of the decrypted document by verifying the hash in the signature (if any) in the document, or by verifying a hash of the document within the document (if any).

### 5.3. Signing and Encrypting

When an Atom Document is to be both signed and encrypted, it is generally a good idea to first sign the document, then encrypt the signed document. Note that, if MACs are used for authentication, the order MUST be that the document is signed and then encrypted, and not the other way around.

## 6. Extending Atom

### 6.1. Extensions from Non-Atom Vocabularies

Markup from other vocabularies ("foreign markup") can be used in an Atom Document. Note that the `atom:content` element is designed to support the inclusion of arbitrary foreign markup.

### 6.2. Extensions to the Atom Vocabulary

The Atom namespace is reserved for future forward-compatible revisions of Atom. Future versions of this specification could add new elements and attributes to the Atom markup vocabulary.

### 6.3. Processing Foreign Markup

Atom Processors that encounter foreign markup in a location that is legal according to this specification MUST NOT stop processing or signal an error.

- When unknown foreign markup is encountered as a child of `atom:entry`, `atom:feed`, or a Person construct, Atom Processors MAY bypass the markup and any textual content and MUST NOT change their behavior as a result of the markup's presence.
- When unknown foreign markup is encountered in a Text Construct or `atom:content` element, software SHOULD ignore the markup and process any text content of foreign elements as though the surrounding markup were not present.

### 6.4. Extension Elements

Atom allows foreign markup anywhere in an Atom document, except where it is explicitly forbidden.

#### 6.4.1. Simple Extension Elements

A Simple Extension element MUST NOT have any attributes or child elements. The element MAY contain character data or be empty. Simple Extension elements are not Language-Sensitive.

```
simpleExtensionElement =
   element * - atom:* {
      text
   }
```

#### 6.4.2. Structured Extension Elements

The root element of a Structured Extension element MUST have at least one attribute or child element. It MAY have attributes, it MAY contain well-formed XML content (including character data), or it MAY be empty. Structured Extension elements are Language-Sensitive.

```
structuredExtensionElement =
   element * - atom:* {
      (attribute * { text }+,
         (text|anyElement)*)
    | (attribute * { text }*,
       (text?, anyElement+, (text|anyElement)*))
   }
```

## 7. IANA Considerations

An Atom Document, when serialized as XML 1.0, can be identified with the following media type:

| Field                          | Value                                     |
| ------------------------------ | ----------------------------------------- |
| MIME media type name           | `application`                             |
| MIME subtype name              | `atom+xml`                                |
| Mandatory parameters           | None                                      |
| Optional parameters            | `charset` (identical to `application/xml`) |
| File extension                 | `.atom`                                   |
| Macintosh File Type code       | `TEXT`                                    |
| Intended usage                 | COMMON                                    |
| Author/Change controller       | IESG                                      |

### 7.1. Registry of Link Relations

This registry is maintained by IANA and initially contains five values: `"alternate"`, `"related"`, `"self"`, `"enclosure"`, and `"via"`. New assignments are subject to IESG Approval.

## 8. Security Considerations

### 8.1. HTML and XHTML Content

Text constructs and `atom:content` allow the delivery of HTML and XHTML. Many elements in these languages are considered 'unsafe' in that they open clients to one or more types of attack. Implementers should carefully consider their handling of every type of element when processing incoming (X)HTML in Atom Documents.

Atom Processors should pay particular attention to the security of the `IMG`, `SCRIPT`, `EMBED`, `OBJECT`, `FRAME`, `FRAMESET`, `IFRAME`, `META`, and `LINK` elements.

### 8.2. URIs

Atom Processors handle URIs. See Section 7 of RFC 3986.

### 8.3. IRIs

Atom Processors handle IRIs. See Section 8 of RFC 3987.

### 8.4. Spoofing

Atom Processors should be aware of the potential for spoofing attacks where the attacker publishes an `atom:entry` with the `atom:id` value of an entry from another feed, perhaps with a falsified `atom:source` element.

### 8.5. Encryption and Signing

Atom Documents can be encrypted and signed using XML Encryption and XML-Signature respectively. Digital signatures provide authentication, message integrity, and non-repudiation with proof of origin. Encryption provides data confidentiality.

## 9. References

### 9.1. Normative References

- **[HTML]** Raggett, D., et al., "HTML 4.01 Specification", W3C REC, December 1999.
- **[MIMEREG]** Freed, N. and J. Klensin, "Media Type Specifications and Registration Procedures", BCP 13, RFC 4288, December 2005.
- **[RFC2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997.
- **[RFC2822]** Resnick, P., "Internet Message Format", RFC 2822, April 2001.
- **[RFC2854]** Connolly, D. and L. Masinter, "The 'text/html' Media Type", RFC 2854, June 2000.
- **[RFC3023]** Murata, M., et al., "XML Media Types", RFC 3023, January 2001.
- **[RFC3066]** Alvestrand, H., "Tags for the Identification of Languages", BCP 47, RFC 3066, January 2001.
- **[RFC3339]** Klyne, G. and C. Newman, "Date and Time on the Internet: Timestamps", RFC 3339, July 2002.
- **[RFC3548]** Josefsson, S., "The Base16, Base32, and Base64 Data Encodings", RFC 3548, July 2003.
- **[RFC3986]** Berners-Lee, T., et al., "Uniform Resource Identifier (URI): Generic Syntax", STD 66, RFC 3986, January 2005.
- **[RFC3987]** Duerst, M. and M. Suignard, "Internationalized Resource Identifiers (IRIs)", RFC 3987, January 2005.
- **[W3C.REC-xml-20040204]** "Extensible Markup Language (XML) 1.0 (Third Edition)", W3C REC, February 2004.
- **[W3C.REC-xml-c14n-20010315]** "Canonical XML Version 1.0", W3C REC, March 2001.
- **[W3C.REC-xml-exc-c14n-20020718]** "Exclusive XML Canonicalization Version 1.0", W3C REC, July 2002.
- **[W3C.REC-xml-infoset-20040204]** "XML Information Set (Second Edition)", W3C REC, February 2004.
- **[W3C.REC-xml-names-19990114]** "Namespaces in XML", W3C REC, January 1999.
- **[W3C.REC-xmlbase-20010627]** "XML Base", W3C REC, June 2001.
- **[W3C.REC-xmldsig-core-20020212]** "XML-Signature Syntax and Processing", W3C REC, February 2002.
- **[W3C.REC-xmlenc-core-20021210]** "XML Encryption Syntax and Processing", W3C REC, December 2002.
- **[XHTML]** "Modularization of XHTML", W3C REC, April 2001.

### 9.2. Informative References

- **[ISO.8601.1988]** "Data elements and interchange formats - Information interchange - Representation of dates and times", ISO Standard 8601, June 1988.
- **[RELAX-NG]** Clark, J., "RELAX NG Compact Syntax", December 2001.
- **[RFC2434]** Narten, T. and H. Alvestrand, "Guidelines for Writing an IANA Considerations Section in RFCs", BCP 26, RFC 2434, October 1998.

## Appendix A. Contributors

The following people contributed to preliminary versions of this document: Tim Bray, Mark Pilgrim, and Sam Ruby. Norman Walsh provided the Relax NG schema. The content and concepts within are a product of the Atom community and the Atompub Working Group.

## Appendix B. RELAX NG Compact Schema

This appendix is informative.

```rnc
# -*- rnc -*-
# RELAX NG Compact Syntax Grammar for the
# Atom Format Specification Version 11

namespace atom = "http://www.w3.org/2005/Atom"
namespace xhtml = "http://www.w3.org/1999/xhtml"
namespace s = "http://www.ascc.net/xml/schematron"
namespace local = ""

start = atomFeed | atomEntry

# Common attributes

atomCommonAttributes =
   attribute xml:base { atomUri }?,
   attribute xml:lang { atomLanguageTag }?,
   undefinedAttribute*

# Text Constructs

atomPlainTextConstruct =
   atomCommonAttributes,
   attribute type { "text" | "html" }?,
   text

atomXHTMLTextConstruct =
   atomCommonAttributes,
   attribute type { "xhtml" },
   xhtmlDiv

atomTextConstruct = atomPlainTextConstruct | atomXHTMLTextConstruct

# Person Construct

atomPersonConstruct =
   atomCommonAttributes,
   (element atom:name { text }
    & element atom:uri { atomUri }?
    & element atom:email { atomEmailAddress }?
    & extensionElement*)

# Date Construct

atomDateConstruct =
   atomCommonAttributes,
   xsd:dateTime

# atom:feed

atomFeed =
   [
      s:rule [
         context = "atom:feed"
         s:assert [
            test = "atom:author or not(atom:entry[not(atom:author)])"
            "An atom:feed must have an atom:author unless all "
            ~ "of its atom:entry children have an atom:author."
         ]
      ]
   ]
   element atom:feed {
      atomCommonAttributes,
      (atomAuthor*
       & atomCategory*
       & atomContributor*
       & atomGenerator?
       & atomIcon?
       & atomId
       & atomLink*
       & atomLogo?
       & atomRights?
       & atomSubtitle?
       & atomTitle
       & atomUpdated
       & extensionElement*),
      atomEntry*
   }

# atom:entry

atomEntry =
   [
      s:rule [
         context = "atom:entry"
         s:assert [
            test = "atom:link[@rel='alternate'] "
            ~ "or atom:link[not(@rel)] "
            ~ "or atom:content"
            "An atom:entry must have at least one atom:link element "
            ~ "with a rel attribute of 'alternate' "
            ~ "or an atom:content."
         ]
      ]
      s:rule [
         context = "atom:entry"
         s:assert [
            test = "atom:author or "
            ~ "../atom:author or atom:source/atom:author"
            "An atom:entry must have an atom:author "
            ~ "if its feed does not."
         ]
      ]
   ]
   element atom:entry {
      atomCommonAttributes,
      (atomAuthor*
       & atomCategory*
       & atomContent?
       & atomContributor*
       & atomId
       & atomLink*
       & atomPublished?
       & atomRights?
       & atomSource?
       & atomSummary?
       & atomTitle
       & atomUpdated
       & extensionElement*)
   }

# atom:content

atomInlineTextContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { "text" | "html" }?,
      (text)*
   }

atomInlineXHTMLContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { "xhtml" },
      xhtmlDiv
   }

atomInlineOtherContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { atomMediaType }?,
      (text|anyElement)*
   }

atomOutOfLineContent =
   element atom:content {
      atomCommonAttributes,
      attribute type { atomMediaType }?,
      attribute src { atomUri },
      empty
   }

atomContent = atomInlineTextContent
 | atomInlineXHTMLContent
 | atomInlineOtherContent
 | atomOutOfLineContent

# atom:author

atomAuthor = element atom:author { atomPersonConstruct }

# atom:category

atomCategory =
   element atom:category {
      atomCommonAttributes,
      attribute term { text },
      attribute scheme { atomUri }?,
      attribute label { text }?,
      undefinedContent
   }

# atom:contributor

atomContributor = element atom:contributor { atomPersonConstruct }

# atom:generator

atomGenerator = element atom:generator {
   atomCommonAttributes,
   attribute uri { atomUri }?,
   attribute version { text }?,
   text
}

# atom:icon

atomIcon = element atom:icon {
   atomCommonAttributes,
   (atomUri)
}

# atom:id

atomId = element atom:id {
   atomCommonAttributes,
   (atomUri)
}

# atom:logo

atomLogo = element atom:logo {
   atomCommonAttributes,
   (atomUri)
}

# atom:link

atomLink =
   element atom:link {
      atomCommonAttributes,
      attribute href { atomUri },
      attribute rel { atomNCName | atomUri }?,
      attribute type { atomMediaType }?,
      attribute hreflang { atomLanguageTag }?,
      attribute title { text }?,
      attribute length { text }?,
      undefinedContent
   }

# atom:published

atomPublished = element atom:published { atomDateConstruct }

# atom:rights

atomRights = element atom:rights { atomTextConstruct }

# atom:source

atomSource =
   element atom:source {
      atomCommonAttributes,
      (atomAuthor*
       & atomCategory*
       & atomContributor*
       & atomGenerator?
       & atomIcon?
       & atomId?
       & atomLink*
       & atomLogo?
       & atomRights?
       & atomSubtitle?
       & atomTitle?
       & atomUpdated?
       & extensionElement*)
   }

# atom:subtitle

atomSubtitle = element atom:subtitle { atomTextConstruct }

# atom:summary

atomSummary = element atom:summary { atomTextConstruct }

# atom:title

atomTitle = element atom:title { atomTextConstruct }

# atom:updated

atomUpdated = element atom:updated { atomDateConstruct }

# Low-level simple types

atomNCName = xsd:string { minLength = "1" pattern = "[^:]*" }

atomMediaType = xsd:string { pattern = ".+/.+" }

atomLanguageTag = xsd:string {
   pattern = "[A-Za-z]{1,8}(-[A-Za-z0-9]{1,8})*"
}

atomUri = text

atomEmailAddress = xsd:string { pattern = ".+@.+" }

# Simple Extension

simpleExtensionElement =
   element * - atom:* {
      text
   }

# Structured Extension

structuredExtensionElement =
   element * - atom:* {
      (attribute * { text }+,
         (text|anyElement)*)
    | (attribute * { text }*,
       (text?, anyElement+, (text|anyElement)*))
   }

# Other Extensibility

extensionElement =
   simpleExtensionElement | structuredExtensionElement

undefinedAttribute =
  attribute * - (xml:base | xml:lang | local:*) { text }

undefinedContent = (text|anyForeignElement)*

anyElement =
   element * {
      (attribute * { text }
       | text
       | anyElement)*
   }

anyForeignElement =
   element * - atom:* {
      (attribute * { text }
       | text
       | anyElement)*
   }

# XHTML

anyXHTML = element xhtml:* {
   (attribute * { text }
    | text
    | anyXHTML)*
}

xhtmlDiv = element xhtml:div {
   (attribute * { text }
    | text
    | anyXHTML)*
}

# EOF
```

## Authors' Addresses

- **Mark Nottingham** (editor) — mnot@pobox.com — http://www.mnot.net/
- **Robert Sayre** (editor) — rfsayre@boswijck.com — http://boswijck.com

## Full Copyright Statement

Copyright (C) The Internet Society (2005).

This document is subject to the rights, licenses and restrictions contained in BCP 78, and except as set forth therein, the authors retain all their rights.

This document and the information contained herein are provided on an "AS IS" basis and THE CONTRIBUTOR, THE ORGANIZATION HE/SHE REPRESENTS OR IS SPONSORED BY (IF ANY), THE INTERNET SOCIETY AND THE INTERNET ENGINEERING TASK FORCE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE OF THE INFORMATION HEREIN WILL NOT INFRINGE ANY RIGHTS OR ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
