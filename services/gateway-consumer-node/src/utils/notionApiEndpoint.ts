// Note: This copied from https://github.com/makenotion/notion-sdk-js/blob/main/src/api-endpoints.ts on 09-09-2022

type IdRequest = string | string;

export type PersonUserObjectResponse = {
    type: 'person';
    person: { email?: string };
    name: string | null;
    avatar_url: string | null;
    id: IdRequest;
    object: 'user';
};

type EmptyObject = Record<string, never>;

export type PartialUserObjectResponse = { id: IdRequest; object: 'user' };

export type BotUserObjectResponse = {
    type: 'bot';
    bot:
    | EmptyObject
    | {
        owner:
        | {
            type: 'user';
            user:
            | {
                type: 'person';
                person: { email: string };
                name: string | null;
                avatar_url: string | null;
                id: IdRequest;
                object: 'user';
            }
            | PartialUserObjectResponse;
        }
        | { type: 'workspace'; workspace: true };
    };
    name: string | null;
    avatar_url: string | null;
    id: IdRequest;
    object: 'user';
};

export type UserObjectResponse = PersonUserObjectResponse | BotUserObjectResponse;

type StringRequest = string;

type SelectColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';

type SelectPropertyResponse = {
    id: StringRequest;
    name: StringRequest;
    color: SelectColor;
};

type TimeZoneRequest =
    | 'Africa/Abidjan'
    | 'Africa/Accra'
    | 'Africa/Addis_Ababa'
    | 'Africa/Algiers'
    | 'Africa/Asmara'
    | 'Africa/Asmera'
    | 'Africa/Bamako'
    | 'Africa/Bangui'
    | 'Africa/Banjul'
    | 'Africa/Bissau'
    | 'Africa/Blantyre'
    | 'Africa/Brazzaville'
    | 'Africa/Bujumbura'
    | 'Africa/Cairo'
    | 'Africa/Casablanca'
    | 'Africa/Ceuta'
    | 'Africa/Conakry'
    | 'Africa/Dakar'
    | 'Africa/Dar_es_Salaam'
    | 'Africa/Djibouti'
    | 'Africa/Douala'
    | 'Africa/El_Aaiun'
    | 'Africa/Freetown'
    | 'Africa/Gaborone'
    | 'Africa/Harare'
    | 'Africa/Johannesburg'
    | 'Africa/Juba'
    | 'Africa/Kampala'
    | 'Africa/Khartoum'
    | 'Africa/Kigali'
    | 'Africa/Kinshasa'
    | 'Africa/Lagos'
    | 'Africa/Libreville'
    | 'Africa/Lome'
    | 'Africa/Luanda'
    | 'Africa/Lubumbashi'
    | 'Africa/Lusaka'
    | 'Africa/Malabo'
    | 'Africa/Maputo'
    | 'Africa/Maseru'
    | 'Africa/Mbabane'
    | 'Africa/Mogadishu'
    | 'Africa/Monrovia'
    | 'Africa/Nairobi'
    | 'Africa/Ndjamena'
    | 'Africa/Niamey'
    | 'Africa/Nouakchott'
    | 'Africa/Ouagadougou'
    | 'Africa/Porto-Novo'
    | 'Africa/Sao_Tome'
    | 'Africa/Timbuktu'
    | 'Africa/Tripoli'
    | 'Africa/Tunis'
    | 'Africa/Windhoek'
    | 'America/Adak'
    | 'America/Anchorage'
    | 'America/Anguilla'
    | 'America/Antigua'
    | 'America/Araguaina'
    | 'America/Argentina/Buenos_Aires'
    | 'America/Argentina/Catamarca'
    | 'America/Argentina/ComodRivadavia'
    | 'America/Argentina/Cordoba'
    | 'America/Argentina/Jujuy'
    | 'America/Argentina/La_Rioja'
    | 'America/Argentina/Mendoza'
    | 'America/Argentina/Rio_Gallegos'
    | 'America/Argentina/Salta'
    | 'America/Argentina/San_Juan'
    | 'America/Argentina/San_Luis'
    | 'America/Argentina/Tucuman'
    | 'America/Argentina/Ushuaia'
    | 'America/Aruba'
    | 'America/Asuncion'
    | 'America/Atikokan'
    | 'America/Atka'
    | 'America/Bahia'
    | 'America/Bahia_Banderas'
    | 'America/Barbados'
    | 'America/Belem'
    | 'America/Belize'
    | 'America/Blanc-Sablon'
    | 'America/Boa_Vista'
    | 'America/Bogota'
    | 'America/Boise'
    | 'America/Buenos_Aires'
    | 'America/Cambridge_Bay'
    | 'America/Campo_Grande'
    | 'America/Cancun'
    | 'America/Caracas'
    | 'America/Catamarca'
    | 'America/Cayenne'
    | 'America/Cayman'
    | 'America/Chicago'
    | 'America/Chihuahua'
    | 'America/Coral_Harbour'
    | 'America/Cordoba'
    | 'America/Costa_Rica'
    | 'America/Creston'
    | 'America/Cuiaba'
    | 'America/Curacao'
    | 'America/Danmarkshavn'
    | 'America/Dawson'
    | 'America/Dawson_Creek'
    | 'America/Denver'
    | 'America/Detroit'
    | 'America/Dominica'
    | 'America/Edmonton'
    | 'America/Eirunepe'
    | 'America/El_Salvador'
    | 'America/Ensenada'
    | 'America/Fort_Nelson'
    | 'America/Fort_Wayne'
    | 'America/Fortaleza'
    | 'America/Glace_Bay'
    | 'America/Godthab'
    | 'America/Goose_Bay'
    | 'America/Grand_Turk'
    | 'America/Grenada'
    | 'America/Guadeloupe'
    | 'America/Guatemala'
    | 'America/Guayaquil'
    | 'America/Guyana'
    | 'America/Halifax'
    | 'America/Havana'
    | 'America/Hermosillo'
    | 'America/Indiana/Indianapolis'
    | 'America/Indiana/Knox'
    | 'America/Indiana/Marengo'
    | 'America/Indiana/Petersburg'
    | 'America/Indiana/Tell_City'
    | 'America/Indiana/Vevay'
    | 'America/Indiana/Vincennes'
    | 'America/Indiana/Winamac'
    | 'America/Indianapolis'
    | 'America/Inuvik'
    | 'America/Iqaluit'
    | 'America/Jamaica'
    | 'America/Jujuy'
    | 'America/Juneau'
    | 'America/Kentucky/Louisville'
    | 'America/Kentucky/Monticello'
    | 'America/Knox_IN'
    | 'America/Kralendijk'
    | 'America/La_Paz'
    | 'America/Lima'
    | 'America/Los_Angeles'
    | 'America/Louisville'
    | 'America/Lower_Princes'
    | 'America/Maceio'
    | 'America/Managua'
    | 'America/Manaus'
    | 'America/Marigot'
    | 'America/Martinique'
    | 'America/Matamoros'
    | 'America/Mazatlan'
    | 'America/Mendoza'
    | 'America/Menominee'
    | 'America/Merida'
    | 'America/Metlakatla'
    | 'America/Mexico_City'
    | 'America/Miquelon'
    | 'America/Moncton'
    | 'America/Monterrey'
    | 'America/Montevideo'
    | 'America/Montreal'
    | 'America/Montserrat'
    | 'America/Nassau'
    | 'America/New_York'
    | 'America/Nipigon'
    | 'America/Nome'
    | 'America/Noronha'
    | 'America/North_Dakota/Beulah'
    | 'America/North_Dakota/Center'
    | 'America/North_Dakota/New_Salem'
    | 'America/Ojinaga'
    | 'America/Panama'
    | 'America/Pangnirtung'
    | 'America/Paramaribo'
    | 'America/Phoenix'
    | 'America/Port-au-Prince'
    | 'America/Port_of_Spain'
    | 'America/Porto_Acre'
    | 'America/Porto_Velho'
    | 'America/Puerto_Rico'
    | 'America/Punta_Arenas'
    | 'America/Rainy_River'
    | 'America/Rankin_Inlet'
    | 'America/Recife'
    | 'America/Regina'
    | 'America/Resolute'
    | 'America/Rio_Branco'
    | 'America/Rosario'
    | 'America/Santa_Isabel'
    | 'America/Santarem'
    | 'America/Santiago'
    | 'America/Santo_Domingo'
    | 'America/Sao_Paulo'
    | 'America/Scoresbysund'
    | 'America/Shiprock'
    | 'America/Sitka'
    | 'America/St_Barthelemy'
    | 'America/St_Johns'
    | 'America/St_Kitts'
    | 'America/St_Lucia'
    | 'America/St_Thomas'
    | 'America/St_Vincent'
    | 'America/Swift_Current'
    | 'America/Tegucigalpa'
    | 'America/Thule'
    | 'America/Thunder_Bay'
    | 'America/Tijuana'
    | 'America/Toronto'
    | 'America/Tortola'
    | 'America/Vancouver'
    | 'America/Virgin'
    | 'America/Whitehorse'
    | 'America/Winnipeg'
    | 'America/Yakutat'
    | 'America/Yellowknife'
    | 'Antarctica/Casey'
    | 'Antarctica/Davis'
    | 'Antarctica/DumontDUrville'
    | 'Antarctica/Macquarie'
    | 'Antarctica/Mawson'
    | 'Antarctica/McMurdo'
    | 'Antarctica/Palmer'
    | 'Antarctica/Rothera'
    | 'Antarctica/South_Pole'
    | 'Antarctica/Syowa'
    | 'Antarctica/Troll'
    | 'Antarctica/Vostok'
    | 'Arctic/Longyearbyen'
    | 'Asia/Aden'
    | 'Asia/Almaty'
    | 'Asia/Amman'
    | 'Asia/Anadyr'
    | 'Asia/Aqtau'
    | 'Asia/Aqtobe'
    | 'Asia/Ashgabat'
    | 'Asia/Ashkhabad'
    | 'Asia/Atyrau'
    | 'Asia/Baghdad'
    | 'Asia/Bahrain'
    | 'Asia/Baku'
    | 'Asia/Bangkok'
    | 'Asia/Barnaul'
    | 'Asia/Beirut'
    | 'Asia/Bishkek'
    | 'Asia/Brunei'
    | 'Asia/Calcutta'
    | 'Asia/Chita'
    | 'Asia/Choibalsan'
    | 'Asia/Chongqing'
    | 'Asia/Chungking'
    | 'Asia/Colombo'
    | 'Asia/Dacca'
    | 'Asia/Damascus'
    | 'Asia/Dhaka'
    | 'Asia/Dili'
    | 'Asia/Dubai'
    | 'Asia/Dushanbe'
    | 'Asia/Famagusta'
    | 'Asia/Gaza'
    | 'Asia/Harbin'
    | 'Asia/Hebron'
    | 'Asia/Ho_Chi_Minh'
    | 'Asia/Hong_Kong'
    | 'Asia/Hovd'
    | 'Asia/Irkutsk'
    | 'Asia/Istanbul'
    | 'Asia/Jakarta'
    | 'Asia/Jayapura'
    | 'Asia/Jerusalem'
    | 'Asia/Kabul'
    | 'Asia/Kamchatka'
    | 'Asia/Karachi'
    | 'Asia/Kashgar'
    | 'Asia/Kathmandu'
    | 'Asia/Katmandu'
    | 'Asia/Khandyga'
    | 'Asia/Kolkata'
    | 'Asia/Krasnoyarsk'
    | 'Asia/Kuala_Lumpur'
    | 'Asia/Kuching'
    | 'Asia/Kuwait'
    | 'Asia/Macao'
    | 'Asia/Macau'
    | 'Asia/Magadan'
    | 'Asia/Makassar'
    | 'Asia/Manila'
    | 'Asia/Muscat'
    | 'Asia/Nicosia'
    | 'Asia/Novokuznetsk'
    | 'Asia/Novosibirsk'
    | 'Asia/Omsk'
    | 'Asia/Oral'
    | 'Asia/Phnom_Penh'
    | 'Asia/Pontianak'
    | 'Asia/Pyongyang'
    | 'Asia/Qatar'
    | 'Asia/Qostanay'
    | 'Asia/Qyzylorda'
    | 'Asia/Rangoon'
    | 'Asia/Riyadh'
    | 'Asia/Saigon'
    | 'Asia/Sakhalin'
    | 'Asia/Samarkand'
    | 'Asia/Seoul'
    | 'Asia/Shanghai'
    | 'Asia/Singapore'
    | 'Asia/Srednekolymsk'
    | 'Asia/Taipei'
    | 'Asia/Tashkent'
    | 'Asia/Tbilisi'
    | 'Asia/Tehran'
    | 'Asia/Tel_Aviv'
    | 'Asia/Thimbu'
    | 'Asia/Thimphu'
    | 'Asia/Tokyo'
    | 'Asia/Tomsk'
    | 'Asia/Ujung_Pandang'
    | 'Asia/Ulaanbaatar'
    | 'Asia/Ulan_Bator'
    | 'Asia/Urumqi'
    | 'Asia/Ust-Nera'
    | 'Asia/Vientiane'
    | 'Asia/Vladivostok'
    | 'Asia/Yakutsk'
    | 'Asia/Yangon'
    | 'Asia/Yekaterinburg'
    | 'Asia/Yerevan'
    | 'Atlantic/Azores'
    | 'Atlantic/Bermuda'
    | 'Atlantic/Canary'
    | 'Atlantic/Cape_Verde'
    | 'Atlantic/Faeroe'
    | 'Atlantic/Faroe'
    | 'Atlantic/Jan_Mayen'
    | 'Atlantic/Madeira'
    | 'Atlantic/Reykjavik'
    | 'Atlantic/South_Georgia'
    | 'Atlantic/St_Helena'
    | 'Atlantic/Stanley'
    | 'Australia/ACT'
    | 'Australia/Adelaide'
    | 'Australia/Brisbane'
    | 'Australia/Broken_Hill'
    | 'Australia/Canberra'
    | 'Australia/Currie'
    | 'Australia/Darwin'
    | 'Australia/Eucla'
    | 'Australia/Hobart'
    | 'Australia/LHI'
    | 'Australia/Lindeman'
    | 'Australia/Lord_Howe'
    | 'Australia/Melbourne'
    | 'Australia/NSW'
    | 'Australia/North'
    | 'Australia/Perth'
    | 'Australia/Queensland'
    | 'Australia/South'
    | 'Australia/Sydney'
    | 'Australia/Tasmania'
    | 'Australia/Victoria'
    | 'Australia/West'
    | 'Australia/Yancowinna'
    | 'Brazil/Acre'
    | 'Brazil/DeNoronha'
    | 'Brazil/East'
    | 'Brazil/West'
    | 'CET'
    | 'CST6CDT'
    | 'Canada/Atlantic'
    | 'Canada/Central'
    | 'Canada/Eastern'
    | 'Canada/Mountain'
    | 'Canada/Newfoundland'
    | 'Canada/Pacific'
    | 'Canada/Saskatchewan'
    | 'Canada/Yukon'
    | 'Chile/Continental'
    | 'Chile/EasterIsland'
    | 'Cuba'
    | 'EET'
    | 'EST'
    | 'EST5EDT'
    | 'Egypt'
    | 'Eire'
    | 'Etc/GMT'
    | 'Etc/GMT+0'
    | 'Etc/GMT+1'
    | 'Etc/GMT+10'
    | 'Etc/GMT+11'
    | 'Etc/GMT+12'
    | 'Etc/GMT+2'
    | 'Etc/GMT+3'
    | 'Etc/GMT+4'
    | 'Etc/GMT+5'
    | 'Etc/GMT+6'
    | 'Etc/GMT+7'
    | 'Etc/GMT+8'
    | 'Etc/GMT+9'
    | 'Etc/GMT-0'
    | 'Etc/GMT-1'
    | 'Etc/GMT-10'
    | 'Etc/GMT-11'
    | 'Etc/GMT-12'
    | 'Etc/GMT-13'
    | 'Etc/GMT-14'
    | 'Etc/GMT-2'
    | 'Etc/GMT-3'
    | 'Etc/GMT-4'
    | 'Etc/GMT-5'
    | 'Etc/GMT-6'
    | 'Etc/GMT-7'
    | 'Etc/GMT-8'
    | 'Etc/GMT-9'
    | 'Etc/GMT0'
    | 'Etc/Greenwich'
    | 'Etc/UCT'
    | 'Etc/UTC'
    | 'Etc/Universal'
    | 'Etc/Zulu'
    | 'Europe/Amsterdam'
    | 'Europe/Andorra'
    | 'Europe/Astrakhan'
    | 'Europe/Athens'
    | 'Europe/Belfast'
    | 'Europe/Belgrade'
    | 'Europe/Berlin'
    | 'Europe/Bratislava'
    | 'Europe/Brussels'
    | 'Europe/Bucharest'
    | 'Europe/Budapest'
    | 'Europe/Busingen'
    | 'Europe/Chisinau'
    | 'Europe/Copenhagen'
    | 'Europe/Dublin'
    | 'Europe/Gibraltar'
    | 'Europe/Guernsey'
    | 'Europe/Helsinki'
    | 'Europe/Isle_of_Man'
    | 'Europe/Istanbul'
    | 'Europe/Jersey'
    | 'Europe/Kaliningrad'
    | 'Europe/Kiev'
    | 'Europe/Kirov'
    | 'Europe/Lisbon'
    | 'Europe/Ljubljana'
    | 'Europe/London'
    | 'Europe/Luxembourg'
    | 'Europe/Madrid'
    | 'Europe/Malta'
    | 'Europe/Mariehamn'
    | 'Europe/Minsk'
    | 'Europe/Monaco'
    | 'Europe/Moscow'
    | 'Europe/Nicosia'
    | 'Europe/Oslo'
    | 'Europe/Paris'
    | 'Europe/Podgorica'
    | 'Europe/Prague'
    | 'Europe/Riga'
    | 'Europe/Rome'
    | 'Europe/Samara'
    | 'Europe/San_Marino'
    | 'Europe/Sarajevo'
    | 'Europe/Saratov'
    | 'Europe/Simferopol'
    | 'Europe/Skopje'
    | 'Europe/Sofia'
    | 'Europe/Stockholm'
    | 'Europe/Tallinn'
    | 'Europe/Tirane'
    | 'Europe/Tiraspol'
    | 'Europe/Ulyanovsk'
    | 'Europe/Uzhgorod'
    | 'Europe/Vaduz'
    | 'Europe/Vatican'
    | 'Europe/Vienna'
    | 'Europe/Vilnius'
    | 'Europe/Volgograd'
    | 'Europe/Warsaw'
    | 'Europe/Zagreb'
    | 'Europe/Zaporozhye'
    | 'Europe/Zurich'
    | 'GB'
    | 'GB-Eire'
    | 'GMT'
    | 'GMT+0'
    | 'GMT-0'
    | 'GMT0'
    | 'Greenwich'
    | 'HST'
    | 'Hongkong'
    | 'Iceland'
    | 'Indian/Antananarivo'
    | 'Indian/Chagos'
    | 'Indian/Christmas'
    | 'Indian/Cocos'
    | 'Indian/Comoro'
    | 'Indian/Kerguelen'
    | 'Indian/Mahe'
    | 'Indian/Maldives'
    | 'Indian/Mauritius'
    | 'Indian/Mayotte'
    | 'Indian/Reunion'
    | 'Iran'
    | 'Israel'
    | 'Jamaica'
    | 'Japan'
    | 'Kwajalein'
    | 'Libya'
    | 'MET'
    | 'MST'
    | 'MST7MDT'
    | 'Mexico/BajaNorte'
    | 'Mexico/BajaSur'
    | 'Mexico/General'
    | 'NZ'
    | 'NZ-CHAT'
    | 'Navajo'
    | 'PRC'
    | 'PST8PDT'
    | 'Pacific/Apia'
    | 'Pacific/Auckland'
    | 'Pacific/Bougainville'
    | 'Pacific/Chatham'
    | 'Pacific/Chuuk'
    | 'Pacific/Easter'
    | 'Pacific/Efate'
    | 'Pacific/Enderbury'
    | 'Pacific/Fakaofo'
    | 'Pacific/Fiji'
    | 'Pacific/Funafuti'
    | 'Pacific/Galapagos'
    | 'Pacific/Gambier'
    | 'Pacific/Guadalcanal'
    | 'Pacific/Guam'
    | 'Pacific/Honolulu'
    | 'Pacific/Johnston'
    | 'Pacific/Kiritimati'
    | 'Pacific/Kosrae'
    | 'Pacific/Kwajalein'
    | 'Pacific/Majuro'
    | 'Pacific/Marquesas'
    | 'Pacific/Midway'
    | 'Pacific/Nauru'
    | 'Pacific/Niue'
    | 'Pacific/Norfolk'
    | 'Pacific/Noumea'
    | 'Pacific/Pago_Pago'
    | 'Pacific/Palau'
    | 'Pacific/Pitcairn'
    | 'Pacific/Pohnpei'
    | 'Pacific/Ponape'
    | 'Pacific/Port_Moresby'
    | 'Pacific/Rarotonga'
    | 'Pacific/Saipan'
    | 'Pacific/Samoa'
    | 'Pacific/Tahiti'
    | 'Pacific/Tarawa'
    | 'Pacific/Tongatapu'
    | 'Pacific/Truk'
    | 'Pacific/Wake'
    | 'Pacific/Wallis'
    | 'Pacific/Yap'
    | 'Poland'
    | 'Portugal'
    | 'ROC'
    | 'ROK'
    | 'Singapore'
    | 'Turkey'
    | 'UCT'
    | 'US/Alaska'
    | 'US/Aleutian'
    | 'US/Arizona'
    | 'US/Central'
    | 'US/East-Indiana'
    | 'US/Eastern'
    | 'US/Hawaii'
    | 'US/Indiana-Starke'
    | 'US/Michigan'
    | 'US/Mountain'
    | 'US/Pacific'
    | 'US/Pacific-New'
    | 'US/Samoa'
    | 'UTC'
    | 'Universal'
    | 'W-SU'
    | 'WET'
    | 'Zulu';

type DateResponse = {
    start: string;
    end: string | null;
    time_zone: TimeZoneRequest | null;
};

type TextRequest = string;

type StringFormulaPropertyResponse = { type: 'string'; string: string | null };

type DateFormulaPropertyResponse = { type: 'date'; date: DateResponse | null };

type NumberFormulaPropertyResponse = { type: 'number'; number: number | null };

type BooleanFormulaPropertyResponse = {
    type: 'boolean';
    boolean: boolean | null;
};

type FormulaPropertyResponse =
    | StringFormulaPropertyResponse
    | DateFormulaPropertyResponse
    | NumberFormulaPropertyResponse
    | BooleanFormulaPropertyResponse;

type AnnotationResponse = {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color:
    | 'default'
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'gray_background'
    | 'brown_background'
    | 'orange_background'
    | 'yellow_background'
    | 'green_background'
    | 'blue_background'
    | 'purple_background'
    | 'pink_background'
    | 'red_background';
};

export type TextRichTextItemResponse = {
    type: 'text';
    text: { content: string; link: { url: TextRequest } | null };
    annotations: AnnotationResponse;
    plain_text: string;
    href: string | null;
};

type LinkPreviewMentionResponse = { url: TextRequest };

type TemplateMentionDateTemplateMentionResponse = {
    type: 'template_mention_date';
    template_mention_date: 'today' | 'now';
};

type TemplateMentionUserTemplateMentionResponse = {
    type: 'template_mention_user';
    template_mention_user: 'me';
};

type TemplateMentionResponse = TemplateMentionDateTemplateMentionResponse | TemplateMentionUserTemplateMentionResponse;

export type MentionRichTextItemResponse = {
    type: 'mention';
    mention:
    | { type: 'user'; user: PartialUserObjectResponse | UserObjectResponse }
    | { type: 'date'; date: DateResponse }
    | { type: 'link_preview'; link_preview: LinkPreviewMentionResponse }
    | { type: 'template_mention'; template_mention: TemplateMentionResponse }
    | { type: 'page'; page: { id: IdRequest } }
    | { type: 'database'; database: { id: IdRequest } };
    annotations: AnnotationResponse;
    plain_text: string;
    href: string | null;
};

export type EquationRichTextItemResponse = {
    type: 'equation';
    equation: { expression: TextRequest };
    annotations: AnnotationResponse;
    plain_text: string;
    href: string | null;
};

export type RichTextItemResponse =
    | TextRichTextItemResponse
    | MentionRichTextItemResponse
    | EquationRichTextItemResponse;

type RollupFunction =
    | 'count'
    | 'count_values'
    | 'empty'
    | 'not_empty'
    | 'unique'
    | 'show_unique'
    | 'percent_empty'
    | 'percent_not_empty'
    | 'sum'
    | 'average'
    | 'median'
    | 'min'
    | 'max'
    | 'range'
    | 'earliest_date'
    | 'latest_date'
    | 'date_range'
    | 'checked'
    | 'unchecked'
    | 'percent_checked'
    | 'percent_unchecked'
    | 'count_per_group'
    | 'percent_per_group'
    | 'show_original';

type EmojiRequest =
    | '😀'
    | '😃'
    | '😄'
    | '😁'
    | '😆'
    | '😅'
    | '🤣'
    | '😂'
    | '🙂'
    | '🙃'
    | '😉'
    | '😊'
    | '😇'
    | '🥰'
    | '😍'
    | '🤩'
    | '😘'
    | '😗'
    | '☺️'
    | '☺'
    | '😚'
    | '😙'
    | '🥲'
    | '😋'
    | '😛'
    | '😜'
    | '🤪'
    | '😝'
    | '🤑'
    | '🤗'
    | '🤭'
    | '🤫'
    | '🤔'
    | '🤐'
    | '🤨'
    | '😐'
    | '😑'
    | '😶'
    | '😶‍🌫️'
    | '😶‍🌫'
    | '😏'
    | '😒'
    | '🙄'
    | '😬'
    | '😮‍💨'
    | '🤥'
    | '😌'
    | '😔'
    | '😪'
    | '🤤'
    | '😴'
    | '😷'
    | '🤒'
    | '🤕'
    | '🤢'
    | '🤮'
    | '🤧'
    | '🥵'
    | '🥶'
    | '🥴'
    | '😵'
    | '😵‍💫'
    | '🤯'
    | '🤠'
    | '🥳'
    | '🥸'
    | '😎'
    | '🤓'
    | '🧐'
    | '😕'
    | '😟'
    | '🙁'
    | '☹️'
    | '☹'
    | '😮'
    | '😯'
    | '😲'
    | '😳'
    | '🥺'
    | '😦'
    | '😧'
    | '😨'
    | '😰'
    | '😥'
    | '😢'
    | '😭'
    | '😱'
    | '😖'
    | '😣'
    | '😞'
    | '😓'
    | '😩'
    | '😫'
    | '🥱'
    | '😤'
    | '😡'
    | '😠'
    | '🤬'
    | '😈'
    | '👿'
    | '💀'
    | '☠️'
    | '☠'
    | '💩'
    | '🤡'
    | '👹'
    | '👺'
    | '👻'
    | '👽'
    | '👾'
    | '🤖'
    | '😺'
    | '😸'
    | '😹'
    | '😻'
    | '😼'
    | '😽'
    | '🙀'
    | '😿'
    | '😾'
    | '🙈'
    | '🙉'
    | '🙊'
    | '💋'
    | '💌'
    | '💘'
    | '💝'
    | '💖'
    | '💗'
    | '💓'
    | '💞'
    | '💕'
    | '💟'
    | '❣️'
    | '❣'
    | '💔'
    | '❤️‍🔥'
    | '❤‍🔥'
    | '❤️‍🩹'
    | '❤‍🩹'
    | '❤️'
    | '❤'
    | '🧡'
    | '💛'
    | '💚'
    | '💙'
    | '💜'
    | '🤎'
    | '🖤'
    | '🤍'
    | '💯'
    | '💢'
    | '💥'
    | '💫'
    | '💦'
    | '💨'
    | '🕳️'
    | '🕳'
    | '💣'
    | '💬'
    | '👁️‍🗨️'
    | '🗨️'
    | '🗨'
    | '🗯️'
    | '🗯'
    | '💭'
    | '💤'
    | '👋🏻'
    | '👋🏼'
    | '👋🏽'
    | '👋🏾'
    | '👋🏿'
    | '👋'
    | '🤚🏻'
    | '🤚🏼'
    | '🤚🏽'
    | '🤚🏾'
    | '🤚🏿'
    | '🤚'
    | '🖐🏻'
    | '🖐🏼'
    | '🖐🏽'
    | '🖐🏾'
    | '🖐🏿'
    | '🖐️'
    | '🖐'
    | '✋🏻'
    | '✋🏼'
    | '✋🏽'
    | '✋🏾'
    | '✋🏿'
    | '✋'
    | '🖖🏻'
    | '🖖🏼'
    | '🖖🏽'
    | '🖖🏾'
    | '🖖🏿'
    | '🖖'
    | '👌🏻'
    | '👌🏼'
    | '👌🏽'
    | '👌🏾'
    | '👌🏿'
    | '👌'
    | '🤌🏻'
    | '🤌🏼'
    | '🤌🏽'
    | '🤌🏾'
    | '🤌🏿'
    | '🤌'
    | '🤏🏻'
    | '🤏🏼'
    | '🤏🏽'
    | '🤏🏾'
    | '🤏🏿'
    | '🤏'
    | '✌🏻'
    | '✌🏼'
    | '✌🏽'
    | '✌🏾'
    | '✌🏿'
    | '✌️'
    | '✌'
    | '🤞🏻'
    | '🤞🏼'
    | '🤞🏽'
    | '🤞🏾'
    | '🤞🏿'
    | '🤞'
    | '🤟🏻'
    | '🤟🏼'
    | '🤟🏽'
    | '🤟🏾'
    | '🤟🏿'
    | '🤟'
    | '🤘🏻'
    | '🤘🏼'
    | '🤘🏽'
    | '🤘🏾'
    | '🤘🏿'
    | '🤘'
    | '🤙🏻'
    | '🤙🏼'
    | '🤙🏽'
    | '🤙🏾'
    | '🤙🏿'
    | '🤙'
    | '👈🏻'
    | '👈🏼'
    | '👈🏽'
    | '👈🏾'
    | '👈🏿'
    | '👈'
    | '👉🏻'
    | '👉🏼'
    | '👉🏽'
    | '👉🏾'
    | '👉🏿'
    | '👉'
    | '👆🏻'
    | '👆🏼'
    | '👆🏽'
    | '👆🏾'
    | '👆🏿'
    | '👆'
    | '🖕🏻'
    | '🖕🏼'
    | '🖕🏽'
    | '🖕🏾'
    | '🖕🏿'
    | '🖕'
    | '👇🏻'
    | '👇🏼'
    | '👇🏽'
    | '👇🏾'
    | '👇🏿'
    | '👇'
    | '☝🏻'
    | '☝🏼'
    | '☝🏽'
    | '☝🏾'
    | '☝🏿'
    | '☝️'
    | '☝'
    | '👍🏻'
    | '👍🏼'
    | '👍🏽'
    | '👍🏾'
    | '👍🏿'
    | '👍'
    | '👎🏻'
    | '👎🏼'
    | '👎🏽'
    | '👎🏾'
    | '👎🏿'
    | '👎'
    | '✊🏻'
    | '✊🏼'
    | '✊🏽'
    | '✊🏾'
    | '✊🏿'
    | '✊'
    | '👊🏻'
    | '👊🏼'
    | '👊🏽'
    | '👊🏾'
    | '👊🏿'
    | '👊'
    | '🤛🏻'
    | '🤛🏼'
    | '🤛🏽'
    | '🤛🏾'
    | '🤛🏿'
    | '🤛'
    | '🤜🏻'
    | '🤜🏼'
    | '🤜🏽'
    | '🤜🏾'
    | '🤜🏿'
    | '🤜'
    | '👏🏻'
    | '👏🏼'
    | '👏🏽'
    | '👏🏾'
    | '👏🏿'
    | '👏'
    | '🙌🏻'
    | '🙌🏼'
    | '🙌🏽'
    | '🙌🏾'
    | '🙌🏿'
    | '🙌'
    | '👐🏻'
    | '👐🏼'
    | '👐🏽'
    | '👐🏾'
    | '👐🏿'
    | '👐'
    | '🤲🏻'
    | '🤲🏼'
    | '🤲🏽'
    | '🤲🏾'
    | '🤲🏿'
    | '🤲'
    | '🤝'
    | '🙏🏻'
    | '🙏🏼'
    | '🙏🏽'
    | '🙏🏾'
    | '🙏🏿'
    | '🙏'
    | '✍🏻'
    | '✍🏼'
    | '✍🏽'
    | '✍🏾'
    | '✍🏿'
    | '✍️'
    | '✍'
    | '💅🏻'
    | '💅🏼'
    | '💅🏽'
    | '💅🏾'
    | '💅🏿'
    | '💅'
    | '🤳🏻'
    | '🤳🏼'
    | '🤳🏽'
    | '🤳🏾'
    | '🤳🏿'
    | '🤳'
    | '💪🏻'
    | '💪🏼'
    | '💪🏽'
    | '💪🏾'
    | '💪🏿'
    | '💪'
    | '🦾'
    | '🦿'
    | '🦵🏻'
    | '🦵🏼'
    | '🦵🏽'
    | '🦵🏾'
    | '🦵🏿'
    | '🦵'
    | '🦶🏻'
    | '🦶🏼'
    | '🦶🏽'
    | '🦶🏾'
    | '🦶🏿'
    | '🦶'
    | '👂🏻'
    | '👂🏼'
    | '👂🏽'
    | '👂🏾'
    | '👂🏿'
    | '👂'
    | '🦻🏻'
    | '🦻🏼'
    | '🦻🏽'
    | '🦻🏾'
    | '🦻🏿'
    | '🦻'
    | '👃🏻'
    | '👃🏼'
    | '👃🏽'
    | '👃🏾'
    | '👃🏿'
    | '👃'
    | '🧠'
    | '🫀'
    | '🫁'
    | '🦷'
    | '🦴'
    | '👀'
    | '👁️'
    | '👁'
    | '👅'
    | '👄'
    | '👶🏻'
    | '👶🏼'
    | '👶🏽'
    | '👶🏾'
    | '👶🏿'
    | '👶'
    | '🧒🏻'
    | '🧒🏼'
    | '🧒🏽'
    | '🧒🏾'
    | '🧒🏿'
    | '🧒'
    | '👦🏻'
    | '👦🏼'
    | '👦🏽'
    | '👦🏾'
    | '👦🏿'
    | '👦'
    | '👧🏻'
    | '👧🏼'
    | '👧🏽'
    | '👧🏾'
    | '👧🏿'
    | '👧'
    | '🧑🏻'
    | '🧑🏼'
    | '🧑🏽'
    | '🧑🏾'
    | '🧑🏿'
    | '🧑'
    | '👱🏻'
    | '👱🏼'
    | '👱🏽'
    | '👱🏾'
    | '👱🏿'
    | '👱'
    | '👨🏻'
    | '👨🏼'
    | '👨🏽'
    | '👨🏾'
    | '👨🏿'
    | '👨'
    | '🧔🏻'
    | '🧔🏼'
    | '🧔🏽'
    | '🧔🏾'
    | '🧔🏿'
    | '🧔'
    | '🧔🏻‍♂️'
    | '🧔🏼‍♂️'
    | '🧔🏽‍♂️'
    | '🧔🏾‍♂️'
    | '🧔🏿‍♂️'
    | '🧔‍♂️'
    | '🧔‍♂'
    | '🧔🏻‍♀️'
    | '🧔🏼‍♀️'
    | '🧔🏽‍♀️'
    | '🧔🏾‍♀️'
    | '🧔🏿‍♀️'
    | '🧔‍♀️'
    | '🧔‍♀'
    | '👨🏻‍🦰'
    | '👨🏼‍🦰'
    | '👨🏽‍🦰'
    | '👨🏾‍🦰'
    | '👨🏿‍🦰'
    | '👨‍🦰'
    | '👨🏻‍🦱'
    | '👨🏼‍🦱'
    | '👨🏽‍🦱'
    | '👨🏾‍🦱'
    | '👨🏿‍🦱'
    | '👨‍🦱'
    | '👨🏻‍🦳'
    | '👨🏼‍🦳'
    | '👨🏽‍🦳'
    | '👨🏾‍🦳'
    | '👨🏿‍🦳'
    | '👨‍🦳'
    | '👨🏻‍🦲'
    | '👨🏼‍🦲'
    | '👨🏽‍🦲'
    | '👨🏾‍🦲'
    | '👨🏿‍🦲'
    | '👨‍🦲'
    | '👩🏻'
    | '👩🏼'
    | '👩🏽'
    | '👩🏾'
    | '👩🏿'
    | '👩'
    | '👩🏻‍🦰'
    | '👩🏼‍🦰'
    | '👩🏽‍🦰'
    | '👩🏾‍🦰'
    | '👩🏿‍🦰'
    | '👩‍🦰'
    | '🧑🏻‍🦰'
    | '🧑🏼‍🦰'
    | '🧑🏽‍🦰'
    | '🧑🏾‍🦰'
    | '🧑🏿‍🦰'
    | '🧑‍🦰'
    | '👩🏻‍🦱'
    | '👩🏼‍🦱'
    | '👩🏽‍🦱'
    | '👩🏾‍🦱'
    | '👩🏿‍🦱'
    | '👩‍🦱'
    | '🧑🏻‍🦱'
    | '🧑🏼‍🦱'
    | '🧑🏽‍🦱'
    | '🧑🏾‍🦱'
    | '🧑🏿‍🦱'
    | '🧑‍🦱'
    | '👩🏻‍🦳'
    | '👩🏼‍🦳'
    | '👩🏽‍🦳'
    | '👩🏾‍🦳'
    | '👩🏿‍🦳'
    | '👩‍🦳'
    | '🧑🏻‍🦳'
    | '🧑🏼‍🦳'
    | '🧑🏽‍🦳'
    | '🧑🏾‍🦳'
    | '🧑🏿‍🦳'
    | '🧑‍🦳'
    | '👩🏻‍🦲'
    | '👩🏼‍🦲'
    | '👩🏽‍🦲'
    | '👩🏾‍🦲'
    | '👩🏿‍🦲'
    | '👩‍🦲'
    | '🧑🏻‍🦲'
    | '🧑🏼‍🦲'
    | '🧑🏽‍🦲'
    | '🧑🏾‍🦲'
    | '🧑🏿‍🦲'
    | '🧑‍🦲'
    | '👱🏻‍♀️'
    | '👱🏼‍♀️'
    | '👱🏽‍♀️'
    | '👱🏾‍♀️'
    | '👱🏿‍♀️'
    | '👱‍♀️'
    | '👱‍♀'
    | '👱🏻‍♂️'
    | '👱🏼‍♂️'
    | '👱🏽‍♂️'
    | '👱🏾‍♂️'
    | '👱🏿‍♂️'
    | '👱‍♂️'
    | '👱‍♂'
    | '🧓🏻'
    | '🧓🏼'
    | '🧓🏽'
    | '🧓🏾'
    | '🧓🏿'
    | '🧓'
    | '👴🏻'
    | '👴🏼'
    | '👴🏽'
    | '👴🏾'
    | '👴🏿'
    | '👴'
    | '👵🏻'
    | '👵🏼'
    | '👵🏽'
    | '👵🏾'
    | '👵🏿'
    | '👵'
    | '🙍🏻'
    | '🙍🏼'
    | '🙍🏽'
    | '🙍🏾'
    | '🙍🏿'
    | '🙍'
    | '🙍🏻‍♂️'
    | '🙍🏼‍♂️'
    | '🙍🏽‍♂️'
    | '🙍🏾‍♂️'
    | '🙍🏿‍♂️'
    | '🙍‍♂️'
    | '🙍‍♂'
    | '🙍🏻‍♀️'
    | '🙍🏼‍♀️'
    | '🙍🏽‍♀️'
    | '🙍🏾‍♀️'
    | '🙍🏿‍♀️'
    | '🙍‍♀️'
    | '🙍‍♀'
    | '🙎🏻'
    | '🙎🏼'
    | '🙎🏽'
    | '🙎🏾'
    | '🙎🏿'
    | '🙎'
    | '🙎🏻‍♂️'
    | '🙎🏼‍♂️'
    | '🙎🏽‍♂️'
    | '🙎🏾‍♂️'
    | '🙎🏿‍♂️'
    | '🙎‍♂️'
    | '🙎‍♂'
    | '🙎🏻‍♀️'
    | '🙎🏼‍♀️'
    | '🙎🏽‍♀️'
    | '🙎🏾‍♀️'
    | '🙎🏿‍♀️'
    | '🙎‍♀️'
    | '🙎‍♀'
    | '🙅🏻'
    | '🙅🏼'
    | '🙅🏽'
    | '🙅🏾'
    | '🙅🏿'
    | '🙅'
    | '🙅🏻‍♂️'
    | '🙅🏼‍♂️'
    | '🙅🏽‍♂️'
    | '🙅🏾‍♂️'
    | '🙅🏿‍♂️'
    | '🙅‍♂️'
    | '🙅‍♂'
    | '🙅🏻‍♀️'
    | '🙅🏼‍♀️'
    | '🙅🏽‍♀️'
    | '🙅🏾‍♀️'
    | '🙅🏿‍♀️'
    | '🙅‍♀️'
    | '🙅‍♀'
    | '🙆🏻'
    | '🙆🏼'
    | '🙆🏽'
    | '🙆🏾'
    | '🙆🏿'
    | '🙆'
    | '🙆🏻‍♂️'
    | '🙆🏼‍♂️'
    | '🙆🏽‍♂️'
    | '🙆🏾‍♂️'
    | '🙆🏿‍♂️'
    | '🙆‍♂️'
    | '🙆‍♂'
    | '🙆🏻‍♀️'
    | '🙆🏼‍♀️'
    | '🙆🏽‍♀️'
    | '🙆🏾‍♀️'
    | '🙆🏿‍♀️'
    | '🙆‍♀️'
    | '🙆‍♀'
    | '💁🏻'
    | '💁🏼'
    | '💁🏽'
    | '💁🏾'
    | '💁🏿'
    | '💁'
    | '💁🏻‍♂️'
    | '💁🏼‍♂️'
    | '💁🏽‍♂️'
    | '💁🏾‍♂️'
    | '💁🏿‍♂️'
    | '💁‍♂️'
    | '💁‍♂'
    | '💁🏻‍♀️'
    | '💁🏼‍♀️'
    | '💁🏽‍♀️'
    | '💁🏾‍♀️'
    | '💁🏿‍♀️'
    | '💁‍♀️'
    | '💁‍♀'
    | '🙋🏻'
    | '🙋🏼'
    | '🙋🏽'
    | '🙋🏾'
    | '🙋🏿'
    | '🙋'
    | '🙋🏻‍♂️'
    | '🙋🏼‍♂️'
    | '🙋🏽‍♂️'
    | '🙋🏾‍♂️'
    | '🙋🏿‍♂️'
    | '🙋‍♂️'
    | '🙋‍♂'
    | '🙋🏻‍♀️'
    | '🙋🏼‍♀️'
    | '🙋🏽‍♀️'
    | '🙋🏾‍♀️'
    | '🙋🏿‍♀️'
    | '🙋‍♀️'
    | '🙋‍♀'
    | '🧏🏻'
    | '🧏🏼'
    | '🧏🏽'
    | '🧏🏾'
    | '🧏🏿'
    | '🧏'
    | '🧏🏻‍♂️'
    | '🧏🏼‍♂️'
    | '🧏🏽‍♂️'
    | '🧏🏾‍♂️'
    | '🧏🏿‍♂️'
    | '🧏‍♂️'
    | '🧏‍♂'
    | '🧏🏻‍♀️'
    | '🧏🏼‍♀️'
    | '🧏🏽‍♀️'
    | '🧏🏾‍♀️'
    | '🧏🏿‍♀️'
    | '🧏‍♀️'
    | '🧏‍♀'
    | '🙇🏻'
    | '🙇🏼'
    | '🙇🏽'
    | '🙇🏾'
    | '🙇🏿'
    | '🙇'
    | '🙇🏻‍♂️'
    | '🙇🏼‍♂️'
    | '🙇🏽‍♂️'
    | '🙇🏾‍♂️'
    | '🙇🏿‍♂️'
    | '🙇‍♂️'
    | '🙇‍♂'
    | '🙇🏻‍♀️'
    | '🙇🏼‍♀️'
    | '🙇🏽‍♀️'
    | '🙇🏾‍♀️'
    | '🙇🏿‍♀️'
    | '🙇‍♀️'
    | '🙇‍♀'
    | '🤦🏻'
    | '🤦🏼'
    | '🤦🏽'
    | '🤦🏾'
    | '🤦🏿'
    | '🤦'
    | '🤦🏻‍♂️'
    | '🤦🏼‍♂️'
    | '🤦🏽‍♂️'
    | '🤦🏾‍♂️'
    | '🤦🏿‍♂️'
    | '🤦‍♂️'
    | '🤦‍♂'
    | '🤦🏻‍♀️'
    | '🤦🏼‍♀️'
    | '🤦🏽‍♀️'
    | '🤦🏾‍♀️'
    | '🤦🏿‍♀️'
    | '🤦‍♀️'
    | '🤦‍♀'
    | '🤷🏻'
    | '🤷🏼'
    | '🤷🏽'
    | '🤷🏾'
    | '🤷🏿'
    | '🤷'
    | '🤷🏻‍♂️'
    | '🤷🏼‍♂️'
    | '🤷🏽‍♂️'
    | '🤷🏾‍♂️'
    | '🤷🏿‍♂️'
    | '🤷‍♂️'
    | '🤷‍♂'
    | '🤷🏻‍♀️'
    | '🤷🏼‍♀️'
    | '🤷🏽‍♀️'
    | '🤷🏾‍♀️'
    | '🤷🏿‍♀️'
    | '🤷‍♀️'
    | '🤷‍♀'
    | '🧑🏻‍⚕️'
    | '🧑🏼‍⚕️'
    | '🧑🏽‍⚕️'
    | '🧑🏾‍⚕️'
    | '🧑🏿‍⚕️'
    | '🧑‍⚕️'
    | '🧑‍⚕'
    | '👨🏻‍⚕️'
    | '👨🏼‍⚕️'
    | '👨🏽‍⚕️'
    | '👨🏾‍⚕️'
    | '👨🏿‍⚕️'
    | '👨‍⚕️'
    | '👨‍⚕'
    | '👩🏻‍⚕️'
    | '👩🏼‍⚕️'
    | '👩🏽‍⚕️'
    | '👩🏾‍⚕️'
    | '👩🏿‍⚕️'
    | '👩‍⚕️'
    | '👩‍⚕'
    | '🧑🏻‍🎓'
    | '🧑🏼‍🎓'
    | '🧑🏽‍🎓'
    | '🧑🏾‍🎓'
    | '🧑🏿‍🎓'
    | '🧑‍🎓'
    | '👨🏻‍🎓'
    | '👨🏼‍🎓'
    | '👨🏽‍🎓'
    | '👨🏾‍🎓'
    | '👨🏿‍🎓'
    | '👨‍🎓'
    | '👩🏻‍🎓'
    | '👩🏼‍🎓'
    | '👩🏽‍🎓'
    | '👩🏾‍🎓'
    | '👩🏿‍🎓'
    | '👩‍🎓'
    | '🧑🏻‍🏫'
    | '🧑🏼‍🏫'
    | '🧑🏽‍🏫'
    | '🧑🏾‍🏫'
    | '🧑🏿‍🏫'
    | '🧑‍🏫'
    | '👨🏻‍🏫'
    | '👨🏼‍🏫'
    | '👨🏽‍🏫'
    | '👨🏾‍🏫'
    | '👨🏿‍🏫'
    | '👨‍🏫'
    | '👩🏻‍🏫'
    | '👩🏼‍🏫'
    | '👩🏽‍🏫'
    | '👩🏾‍🏫'
    | '👩🏿‍🏫'
    | '👩‍🏫'
    | '🧑🏻‍⚖️'
    | '🧑🏼‍⚖️'
    | '🧑🏽‍⚖️'
    | '🧑🏾‍⚖️'
    | '🧑🏿‍⚖️'
    | '🧑‍⚖️'
    | '🧑‍⚖'
    | '👨🏻‍⚖️'
    | '👨🏼‍⚖️'
    | '👨🏽‍⚖️'
    | '👨🏾‍⚖️'
    | '👨🏿‍⚖️'
    | '👨‍⚖️'
    | '👨‍⚖'
    | '👩🏻‍⚖️'
    | '👩🏼‍⚖️'
    | '👩🏽‍⚖️'
    | '👩🏾‍⚖️'
    | '👩🏿‍⚖️'
    | '👩‍⚖️'
    | '👩‍⚖'
    | '🧑🏻‍🌾'
    | '🧑🏼‍🌾'
    | '🧑🏽‍🌾'
    | '🧑🏾‍🌾'
    | '🧑🏿‍🌾'
    | '🧑‍🌾'
    | '👨🏻‍🌾'
    | '👨🏼‍🌾'
    | '👨🏽‍🌾'
    | '👨🏾‍🌾'
    | '👨🏿‍🌾'
    | '👨‍🌾'
    | '👩🏻‍🌾'
    | '👩🏼‍🌾'
    | '👩🏽‍🌾'
    | '👩🏾‍🌾'
    | '👩🏿‍🌾'
    | '👩‍🌾'
    | '🧑🏻‍🍳'
    | '🧑🏼‍🍳'
    | '🧑🏽‍🍳'
    | '🧑🏾‍🍳'
    | '🧑🏿‍🍳'
    | '🧑‍🍳'
    | '👨🏻‍🍳'
    | '👨🏼‍🍳'
    | '👨🏽‍🍳'
    | '👨🏾‍🍳'
    | '👨🏿‍🍳'
    | '👨‍🍳'
    | '👩🏻‍🍳'
    | '👩🏼‍🍳'
    | '👩🏽‍🍳'
    | '👩🏾‍🍳'
    | '👩🏿‍🍳'
    | '👩‍🍳'
    | '🧑🏻‍🔧'
    | '🧑🏼‍🔧'
    | '🧑🏽‍🔧'
    | '🧑🏾‍🔧'
    | '🧑🏿‍🔧'
    | '🧑‍🔧'
    | '👨🏻‍🔧'
    | '👨🏼‍🔧'
    | '👨🏽‍🔧'
    | '👨🏾‍🔧'
    | '👨🏿‍🔧'
    | '👨‍🔧'
    | '👩🏻‍🔧'
    | '👩🏼‍🔧'
    | '👩🏽‍🔧'
    | '👩🏾‍🔧'
    | '👩🏿‍🔧'
    | '👩‍🔧'
    | '🧑🏻‍🏭'
    | '🧑🏼‍🏭'
    | '🧑🏽‍🏭'
    | '🧑🏾‍🏭'
    | '🧑🏿‍🏭'
    | '🧑‍🏭'
    | '👨🏻‍🏭'
    | '👨🏼‍🏭'
    | '👨🏽‍🏭'
    | '👨🏾‍🏭'
    | '👨🏿‍🏭'
    | '👨‍🏭'
    | '👩🏻‍🏭'
    | '👩🏼‍🏭'
    | '👩🏽‍🏭'
    | '👩🏾‍🏭'
    | '👩🏿‍🏭'
    | '👩‍🏭'
    | '🧑🏻‍💼'
    | '🧑🏼‍💼'
    | '🧑🏽‍💼'
    | '🧑🏾‍💼'
    | '🧑🏿‍💼'
    | '🧑‍💼'
    | '👨🏻‍💼'
    | '👨🏼‍💼'
    | '👨🏽‍💼'
    | '👨🏾‍💼'
    | '👨🏿‍💼'
    | '👨‍💼'
    | '👩🏻‍💼'
    | '👩🏼‍💼'
    | '👩🏽‍💼'
    | '👩🏾‍💼'
    | '👩🏿‍💼'
    | '👩‍💼'
    | '🧑🏻‍🔬'
    | '🧑🏼‍🔬'
    | '🧑🏽‍🔬'
    | '🧑🏾‍🔬'
    | '🧑🏿‍🔬'
    | '🧑‍🔬'
    | '👨🏻‍🔬'
    | '👨🏼‍🔬'
    | '👨🏽‍🔬'
    | '👨🏾‍🔬'
    | '👨🏿‍🔬'
    | '👨‍🔬'
    | '👩🏻‍🔬'
    | '👩🏼‍🔬'
    | '👩🏽‍🔬'
    | '👩🏾‍🔬'
    | '👩🏿‍🔬'
    | '👩‍🔬'
    | '🧑🏻‍💻'
    | '🧑🏼‍💻'
    | '🧑🏽‍💻'
    | '🧑🏾‍💻'
    | '🧑🏿‍💻'
    | '🧑‍💻'
    | '👨🏻‍💻'
    | '👨🏼‍💻'
    | '👨🏽‍💻'
    | '👨🏾‍💻'
    | '👨🏿‍💻'
    | '👨‍💻'
    | '👩🏻‍💻'
    | '👩🏼‍💻'
    | '👩🏽‍💻'
    | '👩🏾‍💻'
    | '👩🏿‍💻'
    | '👩‍💻'
    | '🧑🏻‍🎤'
    | '🧑🏼‍🎤'
    | '🧑🏽‍🎤'
    | '🧑🏾‍🎤'
    | '🧑🏿‍🎤'
    | '🧑‍🎤'
    | '👨🏻‍🎤'
    | '👨🏼‍🎤'
    | '👨🏽‍🎤'
    | '👨🏾‍🎤'
    | '👨🏿‍🎤'
    | '👨‍🎤'
    | '👩🏻‍🎤'
    | '👩🏼‍🎤'
    | '👩🏽‍🎤'
    | '👩🏾‍🎤'
    | '👩🏿‍🎤'
    | '👩‍🎤'
    | '🧑🏻‍🎨'
    | '🧑🏼‍🎨'
    | '🧑🏽‍🎨'
    | '🧑🏾‍🎨'
    | '🧑🏿‍🎨'
    | '🧑‍🎨'
    | '👨🏻‍🎨'
    | '👨🏼‍🎨'
    | '👨🏽‍🎨'
    | '👨🏾‍🎨'
    | '👨🏿‍🎨'
    | '👨‍🎨'
    | '👩🏻‍🎨'
    | '👩🏼‍🎨'
    | '👩🏽‍🎨'
    | '👩🏾‍🎨'
    | '👩🏿‍🎨'
    | '👩‍🎨'
    | '🧑🏻‍✈️'
    | '🧑🏼‍✈️'
    | '🧑🏽‍✈️'
    | '🧑🏾‍✈️'
    | '🧑🏿‍✈️'
    | '🧑‍✈️'
    | '🧑‍✈'
    | '👨🏻‍✈️'
    | '👨🏼‍✈️'
    | '👨🏽‍✈️'
    | '👨🏾‍✈️'
    | '👨🏿‍✈️'
    | '👨‍✈️'
    | '👨‍✈'
    | '👩🏻‍✈️'
    | '👩🏼‍✈️'
    | '👩🏽‍✈️'
    | '👩🏾‍✈️'
    | '👩🏿‍✈️'
    | '👩‍✈️'
    | '👩‍✈'
    | '🧑🏻‍🚀'
    | '🧑🏼‍🚀'
    | '🧑🏽‍🚀'
    | '🧑🏾‍🚀'
    | '🧑🏿‍🚀'
    | '🧑‍🚀'
    | '👨🏻‍🚀'
    | '👨🏼‍🚀'
    | '👨🏽‍🚀'
    | '👨🏾‍🚀'
    | '👨🏿‍🚀'
    | '👨‍🚀'
    | '👩🏻‍🚀'
    | '👩🏼‍🚀'
    | '👩🏽‍🚀'
    | '👩🏾‍🚀'
    | '👩🏿‍🚀'
    | '👩‍🚀'
    | '🧑🏻‍🚒'
    | '🧑🏼‍🚒'
    | '🧑🏽‍🚒'
    | '🧑🏾‍🚒'
    | '🧑🏿‍🚒'
    | '🧑‍🚒'
    | '👨🏻‍🚒'
    | '👨🏼‍🚒'
    | '👨🏽‍🚒'
    | '👨🏾‍🚒'
    | '👨🏿‍🚒'
    | '👨‍🚒'
    | '👩🏻‍🚒'
    | '👩🏼‍🚒'
    | '👩🏽‍🚒'
    | '👩🏾‍🚒'
    | '👩🏿‍🚒'
    | '👩‍🚒'
    | '👮🏻'
    | '👮🏼'
    | '👮🏽'
    | '👮🏾'
    | '👮🏿'
    | '👮'
    | '👮🏻‍♂️'
    | '👮🏼‍♂️'
    | '👮🏽‍♂️'
    | '👮🏾‍♂️'
    | '👮🏿‍♂️'
    | '👮‍♂️'
    | '👮‍♂'
    | '👮🏻‍♀️'
    | '👮🏼‍♀️'
    | '👮🏽‍♀️'
    | '👮🏾‍♀️'
    | '👮🏿‍♀️'
    | '👮‍♀️'
    | '👮‍♀'
    | '🕵🏻'
    | '🕵🏼'
    | '🕵🏽'
    | '🕵🏾'
    | '🕵🏿'
    | '🕵️'
    | '🕵'
    | '🕵🏻‍♂️'
    | '🕵🏼‍♂️'
    | '🕵🏽‍♂️'
    | '🕵🏾‍♂️'
    | '🕵🏿‍♂️'
    | '🕵️‍♂️'
    | '🕵🏻‍♀️'
    | '🕵🏼‍♀️'
    | '🕵🏽‍♀️'
    | '🕵🏾‍♀️'
    | '🕵🏿‍♀️'
    | '🕵️‍♀️'
    | '💂🏻'
    | '💂🏼'
    | '💂🏽'
    | '💂🏾'
    | '💂🏿'
    | '💂'
    | '💂🏻‍♂️'
    | '💂🏼‍♂️'
    | '💂🏽‍♂️'
    | '💂🏾‍♂️'
    | '💂🏿‍♂️'
    | '💂‍♂️'
    | '💂‍♂'
    | '💂🏻‍♀️'
    | '💂🏼‍♀️'
    | '💂🏽‍♀️'
    | '💂🏾‍♀️'
    | '💂🏿‍♀️'
    | '💂‍♀️'
    | '💂‍♀'
    | '🥷🏻'
    | '🥷🏼'
    | '🥷🏽'
    | '🥷🏾'
    | '🥷🏿'
    | '🥷'
    | '👷🏻'
    | '👷🏼'
    | '👷🏽'
    | '👷🏾'
    | '👷🏿'
    | '👷'
    | '👷🏻‍♂️'
    | '👷🏼‍♂️'
    | '👷🏽‍♂️'
    | '👷🏾‍♂️'
    | '👷🏿‍♂️'
    | '👷‍♂️'
    | '👷‍♂'
    | '👷🏻‍♀️'
    | '👷🏼‍♀️'
    | '👷🏽‍♀️'
    | '👷🏾‍♀️'
    | '👷🏿‍♀️'
    | '👷‍♀️'
    | '👷‍♀'
    | '🤴🏻'
    | '🤴🏼'
    | '🤴🏽'
    | '🤴🏾'
    | '🤴🏿'
    | '🤴'
    | '👸🏻'
    | '👸🏼'
    | '👸🏽'
    | '👸🏾'
    | '👸🏿'
    | '👸'
    | '👳🏻'
    | '👳🏼'
    | '👳🏽'
    | '👳🏾'
    | '👳🏿'
    | '👳'
    | '👳🏻‍♂️'
    | '👳🏼‍♂️'
    | '👳🏽‍♂️'
    | '👳🏾‍♂️'
    | '👳🏿‍♂️'
    | '👳‍♂️'
    | '👳‍♂'
    | '👳🏻‍♀️'
    | '👳🏼‍♀️'
    | '👳🏽‍♀️'
    | '👳🏾‍♀️'
    | '👳🏿‍♀️'
    | '👳‍♀️'
    | '👳‍♀'
    | '👲🏻'
    | '👲🏼'
    | '👲🏽'
    | '👲🏾'
    | '👲🏿'
    | '👲'
    | '🧕🏻'
    | '🧕🏼'
    | '🧕🏽'
    | '🧕🏾'
    | '🧕🏿'
    | '🧕'
    | '🤵🏻'
    | '🤵🏼'
    | '🤵🏽'
    | '🤵🏾'
    | '🤵🏿'
    | '🤵'
    | '🤵🏻‍♂️'
    | '🤵🏼‍♂️'
    | '🤵🏽‍♂️'
    | '🤵🏾‍♂️'
    | '🤵🏿‍♂️'
    | '🤵‍♂️'
    | '🤵‍♂'
    | '🤵🏻‍♀️'
    | '🤵🏼‍♀️'
    | '🤵🏽‍♀️'
    | '🤵🏾‍♀️'
    | '🤵🏿‍♀️'
    | '🤵‍♀️'
    | '🤵‍♀'
    | '👰🏻'
    | '👰🏼'
    | '👰🏽'
    | '👰🏾'
    | '👰🏿'
    | '👰'
    | '👰🏻‍♂️'
    | '👰🏼‍♂️'
    | '👰🏽‍♂️'
    | '👰🏾‍♂️'
    | '👰🏿‍♂️'
    | '👰‍♂️'
    | '👰‍♂'
    | '👰🏻‍♀️'
    | '👰🏼‍♀️'
    | '👰🏽‍♀️'
    | '👰🏾‍♀️'
    | '👰🏿‍♀️'
    | '👰‍♀️'
    | '👰‍♀'
    | '🤰🏻'
    | '🤰🏼'
    | '🤰🏽'
    | '🤰🏾'
    | '🤰🏿'
    | '🤰'
    | '🤱🏻'
    | '🤱🏼'
    | '🤱🏽'
    | '🤱🏾'
    | '🤱🏿'
    | '🤱'
    | '👩🏻‍🍼'
    | '👩🏼‍🍼'
    | '👩🏽‍🍼'
    | '👩🏾‍🍼'
    | '👩🏿‍🍼'
    | '👩‍🍼'
    | '👨🏻‍🍼'
    | '👨🏼‍🍼'
    | '👨🏽‍🍼'
    | '👨🏾‍🍼'
    | '👨🏿‍🍼'
    | '👨‍🍼'
    | '🧑🏻‍🍼'
    | '🧑🏼‍🍼'
    | '🧑🏽‍🍼'
    | '🧑🏾‍🍼'
    | '🧑🏿‍🍼'
    | '🧑‍🍼'
    | '👼🏻'
    | '👼🏼'
    | '👼🏽'
    | '👼🏾'
    | '👼🏿'
    | '👼'
    | '🎅🏻'
    | '🎅🏼'
    | '🎅🏽'
    | '🎅🏾'
    | '🎅🏿'
    | '🎅'
    | '🤶🏻'
    | '🤶🏼'
    | '🤶🏽'
    | '🤶🏾'
    | '🤶🏿'
    | '🤶'
    | '🧑🏻‍🎄'
    | '🧑🏼‍🎄'
    | '🧑🏽‍🎄'
    | '🧑🏾‍🎄'
    | '🧑🏿‍🎄'
    | '🧑‍🎄'
    | '🦸🏻'
    | '🦸🏼'
    | '🦸🏽'
    | '🦸🏾'
    | '🦸🏿'
    | '🦸'
    | '🦸🏻‍♂️'
    | '🦸🏼‍♂️'
    | '🦸🏽‍♂️'
    | '🦸🏾‍♂️'
    | '🦸🏿‍♂️'
    | '🦸‍♂️'
    | '🦸‍♂'
    | '🦸🏻‍♀️'
    | '🦸🏼‍♀️'
    | '🦸🏽‍♀️'
    | '🦸🏾‍♀️'
    | '🦸🏿‍♀️'
    | '🦸‍♀️'
    | '🦸‍♀'
    | '🦹🏻'
    | '🦹🏼'
    | '🦹🏽'
    | '🦹🏾'
    | '🦹🏿'
    | '🦹'
    | '🦹🏻‍♂️'
    | '🦹🏼‍♂️'
    | '🦹🏽‍♂️'
    | '🦹🏾‍♂️'
    | '🦹🏿‍♂️'
    | '🦹‍♂️'
    | '🦹‍♂'
    | '🦹🏻‍♀️'
    | '🦹🏼‍♀️'
    | '🦹🏽‍♀️'
    | '🦹🏾‍♀️'
    | '🦹🏿‍♀️'
    | '🦹‍♀️'
    | '🦹‍♀'
    | '🧙🏻'
    | '🧙🏼'
    | '🧙🏽'
    | '🧙🏾'
    | '🧙🏿'
    | '🧙'
    | '🧙🏻‍♂️'
    | '🧙🏼‍♂️'
    | '🧙🏽‍♂️'
    | '🧙🏾‍♂️'
    | '🧙🏿‍♂️'
    | '🧙‍♂️'
    | '🧙‍♂'
    | '🧙🏻‍♀️'
    | '🧙🏼‍♀️'
    | '🧙🏽‍♀️'
    | '🧙🏾‍♀️'
    | '🧙🏿‍♀️'
    | '🧙‍♀️'
    | '🧙‍♀'
    | '🧚🏻'
    | '🧚🏼'
    | '🧚🏽'
    | '🧚🏾'
    | '🧚🏿'
    | '🧚'
    | '🧚🏻‍♂️'
    | '🧚🏼‍♂️'
    | '🧚🏽‍♂️'
    | '🧚🏾‍♂️'
    | '🧚🏿‍♂️'
    | '🧚‍♂️'
    | '🧚‍♂'
    | '🧚🏻‍♀️'
    | '🧚🏼‍♀️'
    | '🧚🏽‍♀️'
    | '🧚🏾‍♀️'
    | '🧚🏿‍♀️'
    | '🧚‍♀️'
    | '🧚‍♀'
    | '🧛🏻'
    | '🧛🏼'
    | '🧛🏽'
    | '🧛🏾'
    | '🧛🏿'
    | '🧛'
    | '🧛🏻‍♂️'
    | '🧛🏼‍♂️'
    | '🧛🏽‍♂️'
    | '🧛🏾‍♂️'
    | '🧛🏿‍♂️'
    | '🧛‍♂️'
    | '🧛‍♂'
    | '🧛🏻‍♀️'
    | '🧛🏼‍♀️'
    | '🧛🏽‍♀️'
    | '🧛🏾‍♀️'
    | '🧛🏿‍♀️'
    | '🧛‍♀️'
    | '🧛‍♀'
    | '🧜🏻'
    | '🧜🏼'
    | '🧜🏽'
    | '🧜🏾'
    | '🧜🏿'
    | '🧜'
    | '🧜🏻‍♂️'
    | '🧜🏼‍♂️'
    | '🧜🏽‍♂️'
    | '🧜🏾‍♂️'
    | '🧜🏿‍♂️'
    | '🧜‍♂️'
    | '🧜‍♂'
    | '🧜🏻‍♀️'
    | '🧜🏼‍♀️'
    | '🧜🏽‍♀️'
    | '🧜🏾‍♀️'
    | '🧜🏿‍♀️'
    | '🧜‍♀️'
    | '🧜‍♀'
    | '🧝🏻'
    | '🧝🏼'
    | '🧝🏽'
    | '🧝🏾'
    | '🧝🏿'
    | '🧝'
    | '🧝🏻‍♂️'
    | '🧝🏼‍♂️'
    | '🧝🏽‍♂️'
    | '🧝🏾‍♂️'
    | '🧝🏿‍♂️'
    | '🧝‍♂️'
    | '🧝‍♂'
    | '🧝🏻‍♀️'
    | '🧝🏼‍♀️'
    | '🧝🏽‍♀️'
    | '🧝🏾‍♀️'
    | '🧝🏿‍♀️'
    | '🧝‍♀️'
    | '🧝‍♀'
    | '🧞'
    | '🧞‍♂️'
    | '🧞‍♂'
    | '🧞‍♀️'
    | '🧞‍♀'
    | '🧟'
    | '🧟‍♂️'
    | '🧟‍♂'
    | '🧟‍♀️'
    | '🧟‍♀'
    | '💆🏻'
    | '💆🏼'
    | '💆🏽'
    | '💆🏾'
    | '💆🏿'
    | '💆'
    | '💆🏻‍♂️'
    | '💆🏼‍♂️'
    | '💆🏽‍♂️'
    | '💆🏾‍♂️'
    | '💆🏿‍♂️'
    | '💆‍♂️'
    | '💆‍♂'
    | '💆🏻‍♀️'
    | '💆🏼‍♀️'
    | '💆🏽‍♀️'
    | '💆🏾‍♀️'
    | '💆🏿‍♀️'
    | '💆‍♀️'
    | '💆‍♀'
    | '💇🏻'
    | '💇🏼'
    | '💇🏽'
    | '💇🏾'
    | '💇🏿'
    | '💇'
    | '💇🏻‍♂️'
    | '💇🏼‍♂️'
    | '💇🏽‍♂️'
    | '💇🏾‍♂️'
    | '💇🏿‍♂️'
    | '💇‍♂️'
    | '💇‍♂'
    | '💇🏻‍♀️'
    | '💇🏼‍♀️'
    | '💇🏽‍♀️'
    | '💇🏾‍♀️'
    | '💇🏿‍♀️'
    | '💇‍♀️'
    | '💇‍♀'
    | '🚶🏻'
    | '🚶🏼'
    | '🚶🏽'
    | '🚶🏾'
    | '🚶🏿'
    | '🚶'
    | '🚶🏻‍♂️'
    | '🚶🏼‍♂️'
    | '🚶🏽‍♂️'
    | '🚶🏾‍♂️'
    | '🚶🏿‍♂️'
    | '🚶‍♂️'
    | '🚶‍♂'
    | '🚶🏻‍♀️'
    | '🚶🏼‍♀️'
    | '🚶🏽‍♀️'
    | '🚶🏾‍♀️'
    | '🚶🏿‍♀️'
    | '🚶‍♀️'
    | '🚶‍♀'
    | '🧍🏻'
    | '🧍🏼'
    | '🧍🏽'
    | '🧍🏾'
    | '🧍🏿'
    | '🧍'
    | '🧍🏻‍♂️'
    | '🧍🏼‍♂️'
    | '🧍🏽‍♂️'
    | '🧍🏾‍♂️'
    | '🧍🏿‍♂️'
    | '🧍‍♂️'
    | '🧍‍♂'
    | '🧍🏻‍♀️'
    | '🧍🏼‍♀️'
    | '🧍🏽‍♀️'
    | '🧍🏾‍♀️'
    | '🧍🏿‍♀️'
    | '🧍‍♀️'
    | '🧍‍♀'
    | '🧎🏻'
    | '🧎🏼'
    | '🧎🏽'
    | '🧎🏾'
    | '🧎🏿'
    | '🧎'
    | '🧎🏻‍♂️'
    | '🧎🏼‍♂️'
    | '🧎🏽‍♂️'
    | '🧎🏾‍♂️'
    | '🧎🏿‍♂️'
    | '🧎‍♂️'
    | '🧎‍♂'
    | '🧎🏻‍♀️'
    | '🧎🏼‍♀️'
    | '🧎🏽‍♀️'
    | '🧎🏾‍♀️'
    | '🧎🏿‍♀️'
    | '🧎‍♀️'
    | '🧎‍♀'
    | '🧑🏻‍🦯'
    | '🧑🏼‍🦯'
    | '🧑🏽‍🦯'
    | '🧑🏾‍🦯'
    | '🧑🏿‍🦯'
    | '🧑‍🦯'
    | '👨🏻‍🦯'
    | '👨🏼‍🦯'
    | '👨🏽‍🦯'
    | '👨🏾‍🦯'
    | '👨🏿‍🦯'
    | '👨‍🦯'
    | '👩🏻‍🦯'
    | '👩🏼‍🦯'
    | '👩🏽‍🦯'
    | '👩🏾‍🦯'
    | '👩🏿‍🦯'
    | '👩‍🦯'
    | '🧑🏻‍🦼'
    | '🧑🏼‍🦼'
    | '🧑🏽‍🦼'
    | '🧑🏾‍🦼'
    | '🧑🏿‍🦼'
    | '🧑‍🦼'
    | '👨🏻‍🦼'
    | '👨🏼‍🦼'
    | '👨🏽‍🦼'
    | '👨🏾‍🦼'
    | '👨🏿‍🦼'
    | '👨‍🦼'
    | '👩🏻‍🦼'
    | '👩🏼‍🦼'
    | '👩🏽‍🦼'
    | '👩🏾‍🦼'
    | '👩🏿‍🦼'
    | '👩‍🦼'
    | '🧑🏻‍🦽'
    | '🧑🏼‍🦽'
    | '🧑🏽‍🦽'
    | '🧑🏾‍🦽'
    | '🧑🏿‍🦽'
    | '🧑‍🦽'
    | '👨🏻‍🦽'
    | '👨🏼‍🦽'
    | '👨🏽‍🦽'
    | '👨🏾‍🦽'
    | '👨🏿‍🦽'
    | '👨‍🦽'
    | '👩🏻‍🦽'
    | '👩🏼‍🦽'
    | '👩🏽‍🦽'
    | '👩🏾‍🦽'
    | '👩🏿‍🦽'
    | '👩‍🦽'
    | '🏃🏻'
    | '🏃🏼'
    | '🏃🏽'
    | '🏃🏾'
    | '🏃🏿'
    | '🏃'
    | '🏃🏻‍♂️'
    | '🏃🏼‍♂️'
    | '🏃🏽‍♂️'
    | '🏃🏾‍♂️'
    | '🏃🏿‍♂️'
    | '🏃‍♂️'
    | '🏃‍♂'
    | '🏃🏻‍♀️'
    | '🏃🏼‍♀️'
    | '🏃🏽‍♀️'
    | '🏃🏾‍♀️'
    | '🏃🏿‍♀️'
    | '🏃‍♀️'
    | '🏃‍♀'
    | '💃🏻'
    | '💃🏼'
    | '💃🏽'
    | '💃🏾'
    | '💃🏿'
    | '💃'
    | '🕺🏻'
    | '🕺🏼'
    | '🕺🏽'
    | '🕺🏾'
    | '🕺🏿'
    | '🕺'
    | '🕴🏻'
    | '🕴🏼'
    | '🕴🏽'
    | '🕴🏾'
    | '🕴🏿'
    | '🕴️'
    | '🕴'
    | '👯'
    | '👯‍♂️'
    | '👯‍♂'
    | '👯‍♀️'
    | '👯‍♀'
    | '🧖🏻'
    | '🧖🏼'
    | '🧖🏽'
    | '🧖🏾'
    | '🧖🏿'
    | '🧖'
    | '🧖🏻‍♂️'
    | '🧖🏼‍♂️'
    | '🧖🏽‍♂️'
    | '🧖🏾‍♂️'
    | '🧖🏿‍♂️'
    | '🧖‍♂️'
    | '🧖‍♂'
    | '🧖🏻‍♀️'
    | '🧖🏼‍♀️'
    | '🧖🏽‍♀️'
    | '🧖🏾‍♀️'
    | '🧖🏿‍♀️'
    | '🧖‍♀️'
    | '🧖‍♀'
    | '🧗🏻'
    | '🧗🏼'
    | '🧗🏽'
    | '🧗🏾'
    | '🧗🏿'
    | '🧗'
    | '🧗🏻‍♂️'
    | '🧗🏼‍♂️'
    | '🧗🏽‍♂️'
    | '🧗🏾‍♂️'
    | '🧗🏿‍♂️'
    | '🧗‍♂️'
    | '🧗‍♂'
    | '🧗🏻‍♀️'
    | '🧗🏼‍♀️'
    | '🧗🏽‍♀️'
    | '🧗🏾‍♀️'
    | '🧗🏿‍♀️'
    | '🧗‍♀️'
    | '🧗‍♀'
    | '🤺'
    | '🏇🏻'
    | '🏇🏼'
    | '🏇🏽'
    | '🏇🏾'
    | '🏇🏿'
    | '🏇'
    | '⛷️'
    | '⛷'
    | '🏂🏻'
    | '🏂🏼'
    | '🏂🏽'
    | '🏂🏾'
    | '🏂🏿'
    | '🏂'
    | '🏌🏻'
    | '🏌🏼'
    | '🏌🏽'
    | '🏌🏾'
    | '🏌🏿'
    | '🏌️'
    | '🏌'
    | '🏌🏻‍♂️'
    | '🏌🏼‍♂️'
    | '🏌🏽‍♂️'
    | '🏌🏾‍♂️'
    | '🏌🏿‍♂️'
    | '🏌️‍♂️'
    | '🏌🏻‍♀️'
    | '🏌🏼‍♀️'
    | '🏌🏽‍♀️'
    | '🏌🏾‍♀️'
    | '🏌🏿‍♀️'
    | '🏌️‍♀️'
    | '🏄🏻'
    | '🏄🏼'
    | '🏄🏽'
    | '🏄🏾'
    | '🏄🏿'
    | '🏄'
    | '🏄🏻‍♂️'
    | '🏄🏼‍♂️'
    | '🏄🏽‍♂️'
    | '🏄🏾‍♂️'
    | '🏄🏿‍♂️'
    | '🏄‍♂️'
    | '🏄‍♂'
    | '🏄🏻‍♀️'
    | '🏄🏼‍♀️'
    | '🏄🏽‍♀️'
    | '🏄🏾‍♀️'
    | '🏄🏿‍♀️'
    | '🏄‍♀️'
    | '🏄‍♀'
    | '🚣🏻'
    | '🚣🏼'
    | '🚣🏽'
    | '🚣🏾'
    | '🚣🏿'
    | '🚣'
    | '🚣🏻‍♂️'
    | '🚣🏼‍♂️'
    | '🚣🏽‍♂️'
    | '🚣🏾‍♂️'
    | '🚣🏿‍♂️'
    | '🚣‍♂️'
    | '🚣‍♂'
    | '🚣🏻‍♀️'
    | '🚣🏼‍♀️'
    | '🚣🏽‍♀️'
    | '🚣🏾‍♀️'
    | '🚣🏿‍♀️'
    | '🚣‍♀️'
    | '🚣‍♀'
    | '🏊🏻'
    | '🏊🏼'
    | '🏊🏽'
    | '🏊🏾'
    | '🏊🏿'
    | '🏊'
    | '🏊🏻‍♂️'
    | '🏊🏼‍♂️'
    | '🏊🏽‍♂️'
    | '🏊🏾‍♂️'
    | '🏊🏿‍♂️'
    | '🏊‍♂️'
    | '🏊‍♂'
    | '🏊🏻‍♀️'
    | '🏊🏼‍♀️'
    | '🏊🏽‍♀️'
    | '🏊🏾‍♀️'
    | '🏊🏿‍♀️'
    | '🏊‍♀️'
    | '🏊‍♀'
    | '⛹🏻'
    | '⛹🏼'
    | '⛹🏽'
    | '⛹🏾'
    | '⛹🏿'
    | '⛹️'
    | '⛹'
    | '⛹🏻‍♂️'
    | '⛹🏼‍♂️'
    | '⛹🏽‍♂️'
    | '⛹🏾‍♂️'
    | '⛹🏿‍♂️'
    | '⛹️‍♂️'
    | '⛹🏻‍♀️'
    | '⛹🏼‍♀️'
    | '⛹🏽‍♀️'
    | '⛹🏾‍♀️'
    | '⛹🏿‍♀️'
    | '⛹️‍♀️'
    | '🏋🏻'
    | '🏋🏼'
    | '🏋🏽'
    | '🏋🏾'
    | '🏋🏿'
    | '🏋️'
    | '🏋'
    | '🏋🏻‍♂️'
    | '🏋🏼‍♂️'
    | '🏋🏽‍♂️'
    | '🏋🏾‍♂️'
    | '🏋🏿‍♂️'
    | '🏋️‍♂️'
    | '🏋🏻‍♀️'
    | '🏋🏼‍♀️'
    | '🏋🏽‍♀️'
    | '🏋🏾‍♀️'
    | '🏋🏿‍♀️'
    | '🏋️‍♀️'
    | '🚴🏻'
    | '🚴🏼'
    | '🚴🏽'
    | '🚴🏾'
    | '🚴🏿'
    | '🚴'
    | '🚴🏻‍♂️'
    | '🚴🏼‍♂️'
    | '🚴🏽‍♂️'
    | '🚴🏾‍♂️'
    | '🚴🏿‍♂️'
    | '🚴‍♂️'
    | '🚴‍♂'
    | '🚴🏻‍♀️'
    | '🚴🏼‍♀️'
    | '🚴🏽‍♀️'
    | '🚴🏾‍♀️'
    | '🚴🏿‍♀️'
    | '🚴‍♀️'
    | '🚴‍♀'
    | '🚵🏻'
    | '🚵🏼'
    | '🚵🏽'
    | '🚵🏾'
    | '🚵🏿'
    | '🚵'
    | '🚵🏻‍♂️'
    | '🚵🏼‍♂️'
    | '🚵🏽‍♂️'
    | '🚵🏾‍♂️'
    | '🚵🏿‍♂️'
    | '🚵‍♂️'
    | '🚵‍♂'
    | '🚵🏻‍♀️'
    | '🚵🏼‍♀️'
    | '🚵🏽‍♀️'
    | '🚵🏾‍♀️'
    | '🚵🏿‍♀️'
    | '🚵‍♀️'
    | '🚵‍♀'
    | '🤸🏻'
    | '🤸🏼'
    | '🤸🏽'
    | '🤸🏾'
    | '🤸🏿'
    | '🤸'
    | '🤸🏻‍♂️'
    | '🤸🏼‍♂️'
    | '🤸🏽‍♂️'
    | '🤸🏾‍♂️'
    | '🤸🏿‍♂️'
    | '🤸‍♂️'
    | '🤸‍♂'
    | '🤸🏻‍♀️'
    | '🤸🏼‍♀️'
    | '🤸🏽‍♀️'
    | '🤸🏾‍♀️'
    | '🤸🏿‍♀️'
    | '🤸‍♀️'
    | '🤸‍♀'
    | '🤼'
    | '🤼‍♂️'
    | '🤼‍♂'
    | '🤼‍♀️'
    | '🤼‍♀'
    | '🤽🏻'
    | '🤽🏼'
    | '🤽🏽'
    | '🤽🏾'
    | '🤽🏿'
    | '🤽'
    | '🤽🏻‍♂️'
    | '🤽🏼‍♂️'
    | '🤽🏽‍♂️'
    | '🤽🏾‍♂️'
    | '🤽🏿‍♂️'
    | '🤽‍♂️'
    | '🤽‍♂'
    | '🤽🏻‍♀️'
    | '🤽🏼‍♀️'
    | '🤽🏽‍♀️'
    | '🤽🏾‍♀️'
    | '🤽🏿‍♀️'
    | '🤽‍♀️'
    | '🤽‍♀'
    | '🤾🏻'
    | '🤾🏼'
    | '🤾🏽'
    | '🤾🏾'
    | '🤾🏿'
    | '🤾'
    | '🤾🏻‍♂️'
    | '🤾🏼‍♂️'
    | '🤾🏽‍♂️'
    | '🤾🏾‍♂️'
    | '🤾🏿‍♂️'
    | '🤾‍♂️'
    | '🤾‍♂'
    | '🤾🏻‍♀️'
    | '🤾🏼‍♀️'
    | '🤾🏽‍♀️'
    | '🤾🏾‍♀️'
    | '🤾🏿‍♀️'
    | '🤾‍♀️'
    | '🤾‍♀'
    | '🤹🏻'
    | '🤹🏼'
    | '🤹🏽'
    | '🤹🏾'
    | '🤹🏿'
    | '🤹'
    | '🤹🏻‍♂️'
    | '🤹🏼‍♂️'
    | '🤹🏽‍♂️'
    | '🤹🏾‍♂️'
    | '🤹🏿‍♂️'
    | '🤹‍♂️'
    | '🤹‍♂'
    | '🤹🏻‍♀️'
    | '🤹🏼‍♀️'
    | '🤹🏽‍♀️'
    | '🤹🏾‍♀️'
    | '🤹🏿‍♀️'
    | '🤹‍♀️'
    | '🤹‍♀'
    | '🧘🏻'
    | '🧘🏼'
    | '🧘🏽'
    | '🧘🏾'
    | '🧘🏿'
    | '🧘'
    | '🧘🏻‍♂️'
    | '🧘🏼‍♂️'
    | '🧘🏽‍♂️'
    | '🧘🏾‍♂️'
    | '🧘🏿‍♂️'
    | '🧘‍♂️'
    | '🧘‍♂'
    | '🧘🏻‍♀️'
    | '🧘🏼‍♀️'
    | '🧘🏽‍♀️'
    | '🧘🏾‍♀️'
    | '🧘🏿‍♀️'
    | '🧘‍♀️'
    | '🧘‍♀'
    | '🛀🏻'
    | '🛀🏼'
    | '🛀🏽'
    | '🛀🏾'
    | '🛀🏿'
    | '🛀'
    | '🛌🏻'
    | '🛌🏼'
    | '🛌🏽'
    | '🛌🏾'
    | '🛌🏿'
    | '🛌'
    | '🧑🏻‍🤝‍🧑🏻'
    | '🧑🏻‍🤝‍🧑🏼'
    | '🧑🏻‍🤝‍🧑🏽'
    | '🧑🏻‍🤝‍🧑🏾'
    | '🧑🏻‍🤝‍🧑🏿'
    | '🧑🏼‍🤝‍🧑🏻'
    | '🧑🏼‍🤝‍🧑🏼'
    | '🧑🏼‍🤝‍🧑🏽'
    | '🧑🏼‍🤝‍🧑🏾'
    | '🧑🏼‍🤝‍🧑🏿'
    | '🧑🏽‍🤝‍🧑🏻'
    | '🧑🏽‍🤝‍🧑🏼'
    | '🧑🏽‍🤝‍🧑🏽'
    | '🧑🏽‍🤝‍🧑🏾'
    | '🧑🏽‍🤝‍🧑🏿'
    | '🧑🏾‍🤝‍🧑🏻'
    | '🧑🏾‍🤝‍🧑🏼'
    | '🧑🏾‍🤝‍🧑🏽'
    | '🧑🏾‍🤝‍🧑🏾'
    | '🧑🏾‍🤝‍🧑🏿'
    | '🧑🏿‍🤝‍🧑🏻'
    | '🧑🏿‍🤝‍🧑🏼'
    | '🧑🏿‍🤝‍🧑🏽'
    | '🧑🏿‍🤝‍🧑🏾'
    | '🧑🏿‍🤝‍🧑🏿'
    | '🧑‍🤝‍🧑'
    | '👭'
    | '👫'
    | '👬'
    | '💏'
    | '💑'
    | '👪'
    | '👨‍👩‍👦'
    | '👨‍👩‍👧'
    | '👨‍👩‍👧‍👦'
    | '👨‍👩‍👦‍👦'
    | '👨‍👩‍👧‍👧'
    | '👨‍👨‍👦'
    | '👨‍👨‍👧'
    | '👨‍👨‍👧‍👦'
    | '👨‍👨‍👦‍👦'
    | '👨‍👨‍👧‍👧'
    | '👩‍👩‍👦'
    | '👩‍👩‍👧'
    | '👩‍👩‍👧‍👦'
    | '👩‍👩‍👦‍👦'
    | '👩‍👩‍👧‍👧'
    | '👨‍👦'
    | '👨‍👦‍👦'
    | '👨‍👧'
    | '👨‍👧‍👦'
    | '👨‍👧‍👧'
    | '👩‍👦'
    | '👩‍👦‍👦'
    | '👩‍👧'
    | '👩‍👧‍👦'
    | '👩‍👧‍👧'
    | '🗣️'
    | '🗣'
    | '👤'
    | '👥'
    | '🫂'
    | '👣'
    | '🐵'
    | '🐒'
    | '🦍'
    | '🦧'
    | '🐶'
    | '🐕'
    | '🦮'
    | '🐕‍🦺'
    | '🐩'
    | '🐺'
    | '🦊'
    | '🦝'
    | '🐱'
    | '🐈'
    | '🐈‍⬛'
    | '🦁'
    | '🐯'
    | '🐅'
    | '🐆'
    | '🐴'
    | '🐎'
    | '🦄'
    | '🦓'
    | '🦌'
    | '🦬'
    | '🐮'
    | '🐂'
    | '🐃'
    | '🐄'
    | '🐷'
    | '🐖'
    | '🐗'
    | '🐽'
    | '🐏'
    | '🐑'
    | '🐐'
    | '🐪'
    | '🐫'
    | '🦙'
    | '🦒'
    | '🐘'
    | '🦣'
    | '🦏'
    | '🦛'
    | '🐭'
    | '🐁'
    | '🐀'
    | '🐹'
    | '🐰'
    | '🐇'
    | '🐿️'
    | '🐿'
    | '🦫'
    | '🦔'
    | '🦇'
    | '🐻'
    | '🐻‍❄️'
    | '🐻‍❄'
    | '🐨'
    | '🐼'
    | '🦥'
    | '🦦'
    | '🦨'
    | '🦘'
    | '🦡'
    | '🐾'
    | '🦃'
    | '🐔'
    | '🐓'
    | '🐣'
    | '🐤'
    | '🐥'
    | '🐦'
    | '🐧'
    | '🕊️'
    | '🕊'
    | '🦅'
    | '🦆'
    | '🦢'
    | '🦉'
    | '🦤'
    | '🪶'
    | '🦩'
    | '🦚'
    | '🦜'
    | '🐸'
    | '🐊'
    | '🐢'
    | '🦎'
    | '🐍'
    | '🐲'
    | '🐉'
    | '🦕'
    | '🦖'
    | '🐳'
    | '🐋'
    | '🐬'
    | '🦭'
    | '🐟'
    | '🐠'
    | '🐡'
    | '🦈'
    | '🐙'
    | '🐚'
    | '🐌'
    | '🦋'
    | '🐛'
    | '🐜'
    | '🐝'
    | '🪲'
    | '🐞'
    | '🦗'
    | '🪳'
    | '🕷️'
    | '🕷'
    | '🕸️'
    | '🕸'
    | '🦂'
    | '🦟'
    | '🪰'
    | '🪱'
    | '🦠'
    | '💐'
    | '🌸'
    | '💮'
    | '🏵️'
    | '🏵'
    | '🌹'
    | '🥀'
    | '🌺'
    | '🌻'
    | '🌼'
    | '🌷'
    | '🌱'
    | '🪴'
    | '🌲'
    | '🌳'
    | '🌴'
    | '🌵'
    | '🌾'
    | '🌿'
    | '☘️'
    | '☘'
    | '🍀'
    | '🍁'
    | '🍂'
    | '🍃'
    | '🍇'
    | '🍈'
    | '🍉'
    | '🍊'
    | '🍋'
    | '🍌'
    | '🍍'
    | '🥭'
    | '🍎'
    | '🍏'
    | '🍐'
    | '🍑'
    | '🍒'
    | '🍓'
    | '🫐'
    | '🥝'
    | '🍅'
    | '🫒'
    | '🥥'
    | '🥑'
    | '🍆'
    | '🥔'
    | '🥕'
    | '🌽'
    | '🌶️'
    | '🌶'
    | '🫑'
    | '🥒'
    | '🥬'
    | '🥦'
    | '🧄'
    | '🧅'
    | '🍄'
    | '🥜'
    | '🌰'
    | '🍞'
    | '🥐'
    | '🥖'
    | '🫓'
    | '🥨'
    | '🥯'
    | '🥞'
    | '🧇'
    | '🧀'
    | '🍖'
    | '🍗'
    | '🥩'
    | '🥓'
    | '🍔'
    | '🍟'
    | '🍕'
    | '🌭'
    | '🥪'
    | '🌮'
    | '🌯'
    | '🫔'
    | '🥙'
    | '🧆'
    | '🥚'
    | '🍳'
    | '🥘'
    | '🍲'
    | '🫕'
    | '🥣'
    | '🥗'
    | '🍿'
    | '🧈'
    | '🧂'
    | '🥫'
    | '🍱'
    | '🍘'
    | '🍙'
    | '🍚'
    | '🍛'
    | '🍜'
    | '🍝'
    | '🍠'
    | '🍢'
    | '🍣'
    | '🍤'
    | '🍥'
    | '🥮'
    | '🍡'
    | '🥟'
    | '🥠'
    | '🥡'
    | '🦀'
    | '🦞'
    | '🦐'
    | '🦑'
    | '🦪'
    | '🍦'
    | '🍧'
    | '🍨'
    | '🍩'
    | '🍪'
    | '🎂'
    | '🍰'
    | '🧁'
    | '🥧'
    | '🍫'
    | '🍬'
    | '🍭'
    | '🍮'
    | '🍯'
    | '🍼'
    | '🥛'
    | '☕'
    | '🫖'
    | '🍵'
    | '🍶'
    | '🍾'
    | '🍷'
    | '🍸'
    | '🍹'
    | '🍺'
    | '🍻'
    | '🥂'
    | '🥃'
    | '🥤'
    | '🧋'
    | '🧃'
    | '🧉'
    | '🧊'
    | '🥢'
    | '🍽️'
    | '🍽'
    | '🍴'
    | '🥄'
    | '🔪'
    | '🏺'
    | '🌍'
    | '🌎'
    | '🌏'
    | '🌐'
    | '🗺️'
    | '🗺'
    | '🗾'
    | '🧭'
    | '🏔️'
    | '🏔'
    | '⛰️'
    | '⛰'
    | '🌋'
    | '🗻'
    | '🏕️'
    | '🏕'
    | '🏖️'
    | '🏖'
    | '🏜️'
    | '🏜'
    | '🏝️'
    | '🏝'
    | '🏞️'
    | '🏞'
    | '🏟️'
    | '🏟'
    | '🏛️'
    | '🏛'
    | '🏗️'
    | '🏗'
    | '🧱'
    | '🪨'
    | '🪵'
    | '🛖'
    | '🏘️'
    | '🏘'
    | '🏚️'
    | '🏚'
    | '🏠'
    | '🏡'
    | '🏢'
    | '🏣'
    | '🏤'
    | '🏥'
    | '🏦'
    | '🏨'
    | '🏩'
    | '🏪'
    | '🏫'
    | '🏬'
    | '🏭'
    | '🏯'
    | '🏰'
    | '💒'
    | '🗼'
    | '🗽'
    | '⛪'
    | '🕌'
    | '🛕'
    | '🕍'
    | '⛩️'
    | '⛩'
    | '🕋'
    | '⛲'
    | '⛺'
    | '🌁'
    | '🌃'
    | '🏙️'
    | '🏙'
    | '🌄'
    | '🌅'
    | '🌆'
    | '🌇'
    | '🌉'
    | '♨️'
    | '♨'
    | '🎠'
    | '🎡'
    | '🎢'
    | '💈'
    | '🎪'
    | '🚂'
    | '🚃'
    | '🚄'
    | '🚅'
    | '🚆'
    | '🚇'
    | '🚈'
    | '🚉'
    | '🚊'
    | '🚝'
    | '🚞'
    | '🚋'
    | '🚌'
    | '🚍'
    | '🚎'
    | '🚐'
    | '🚑'
    | '🚒'
    | '🚓'
    | '🚔'
    | '🚕'
    | '🚖'
    | '🚗'
    | '🚘'
    | '🚙'
    | '🛻'
    | '🚚'
    | '🚛'
    | '🚜'
    | '🏎️'
    | '🏎'
    | '🏍️'
    | '🏍'
    | '🛵'
    | '🦽'
    | '🦼'
    | '🛺'
    | '🚲'
    | '🛴'
    | '🛹'
    | '🛼'
    | '🚏'
    | '🛣️'
    | '🛣'
    | '🛤️'
    | '🛤'
    | '🛢️'
    | '🛢'
    | '⛽'
    | '🚨'
    | '🚥'
    | '🚦'
    | '🛑'
    | '🚧'
    | '⚓'
    | '⛵'
    | '🛶'
    | '🚤'
    | '🛳️'
    | '🛳'
    | '⛴️'
    | '⛴'
    | '🛥️'
    | '🛥'
    | '🚢'
    | '✈️'
    | '✈'
    | '🛩️'
    | '🛩'
    | '🛫'
    | '🛬'
    | '🪂'
    | '💺'
    | '🚁'
    | '🚟'
    | '🚠'
    | '🚡'
    | '🛰️'
    | '🛰'
    | '🚀'
    | '🛸'
    | '🛎️'
    | '🛎'
    | '🧳'
    | '⌛'
    | '⏳'
    | '⌚'
    | '⏰'
    | '⏱️'
    | '⏱'
    | '⏲️'
    | '⏲'
    | '🕰️'
    | '🕰'
    | '🕛'
    | '🕧'
    | '🕐'
    | '🕜'
    | '🕑'
    | '🕝'
    | '🕒'
    | '🕞'
    | '🕓'
    | '🕟'
    | '🕔'
    | '🕠'
    | '🕕'
    | '🕡'
    | '🕖'
    | '🕢'
    | '🕗'
    | '🕣'
    | '🕘'
    | '🕤'
    | '🕙'
    | '🕥'
    | '🕚'
    | '🕦'
    | '🌑'
    | '🌒'
    | '🌓'
    | '🌔'
    | '🌕'
    | '🌖'
    | '🌗'
    | '🌘'
    | '🌙'
    | '🌚'
    | '🌛'
    | '🌜'
    | '🌡️'
    | '🌡'
    | '☀️'
    | '☀'
    | '🌝'
    | '🌞'
    | '🪐'
    | '⭐'
    | '🌟'
    | '🌠'
    | '🌌'
    | '☁️'
    | '☁'
    | '⛅'
    | '⛈️'
    | '⛈'
    | '🌤️'
    | '🌤'
    | '🌥️'
    | '🌥'
    | '🌦️'
    | '🌦'
    | '🌧️'
    | '🌧'
    | '🌨️'
    | '🌨'
    | '🌩️'
    | '🌩'
    | '🌪️'
    | '🌪'
    | '🌫️'
    | '🌫'
    | '🌬️'
    | '🌬'
    | '🌀'
    | '🌈'
    | '🌂'
    | '☂️'
    | '☂'
    | '☔'
    | '⛱️'
    | '⛱'
    | '⚡'
    | '❄️'
    | '❄'
    | '☃️'
    | '☃'
    | '⛄'
    | '☄️'
    | '☄'
    | '🔥'
    | '💧'
    | '🌊'
    | '🎃'
    | '🎄'
    | '🎆'
    | '🎇'
    | '🧨'
    | '✨'
    | '🎈'
    | '🎉'
    | '🎊'
    | '🎋'
    | '🎍'
    | '🎎'
    | '🎏'
    | '🎐'
    | '🎑'
    | '🧧'
    | '🎀'
    | '🎁'
    | '🎗️'
    | '🎗'
    | '🎟️'
    | '🎟'
    | '🎫'
    | '🎖️'
    | '🎖'
    | '🏆'
    | '🏅'
    | '🥇'
    | '🥈'
    | '🥉'
    | '⚽'
    | '⚾'
    | '🥎'
    | '🏀'
    | '🏐'
    | '🏈'
    | '🏉'
    | '🎾'
    | '🥏'
    | '🎳'
    | '🏏'
    | '🏑'
    | '🏒'
    | '🥍'
    | '🏓'
    | '🏸'
    | '🥊'
    | '🥋'
    | '🥅'
    | '⛳'
    | '⛸️'
    | '⛸'
    | '🎣'
    | '🤿'
    | '🎽'
    | '🎿'
    | '🛷'
    | '🥌'
    | '🎯'
    | '🪀'
    | '🪁'
    | '🎱'
    | '🔮'
    | '🪄'
    | '🧿'
    | '🎮'
    | '🕹️'
    | '🕹'
    | '🎰'
    | '🎲'
    | '🧩'
    | '🧸'
    | '🪅'
    | '🪆'
    | '♠️'
    | '♠'
    | '♥️'
    | '♥'
    | '♦️'
    | '♦'
    | '♣️'
    | '♣'
    | '♟️'
    | '♟'
    | '🃏'
    | '🀄'
    | '🎴'
    | '🎭'
    | '🖼️'
    | '🖼'
    | '🎨'
    | '🧵'
    | '🪡'
    | '🧶'
    | '🪢'
    | '👓'
    | '🕶️'
    | '🕶'
    | '🥽'
    | '🥼'
    | '🦺'
    | '👔'
    | '👕'
    | '👖'
    | '🧣'
    | '🧤'
    | '🧥'
    | '🧦'
    | '👗'
    | '👘'
    | '🥻'
    | '🩱'
    | '🩲'
    | '🩳'
    | '👙'
    | '👚'
    | '👛'
    | '👜'
    | '👝'
    | '🛍️'
    | '🛍'
    | '🎒'
    | '🩴'
    | '👞'
    | '👟'
    | '🥾'
    | '🥿'
    | '👠'
    | '👡'
    | '🩰'
    | '👢'
    | '👑'
    | '👒'
    | '🎩'
    | '🎓'
    | '🧢'
    | '🪖'
    | '⛑️'
    | '⛑'
    | '📿'
    | '💄'
    | '💍'
    | '💎'
    | '🔇'
    | '🔈'
    | '🔉'
    | '🔊'
    | '📢'
    | '📣'
    | '📯'
    | '🔔'
    | '🔕'
    | '🎼'
    | '🎵'
    | '🎶'
    | '🎙️'
    | '🎙'
    | '🎚️'
    | '🎚'
    | '🎛️'
    | '🎛'
    | '🎤'
    | '🎧'
    | '📻'
    | '🎷'
    | '🪗'
    | '🎸'
    | '🎹'
    | '🎺'
    | '🎻'
    | '🪕'
    | '🥁'
    | '🪘'
    | '📱'
    | '📲'
    | '☎️'
    | '☎'
    | '📞'
    | '📟'
    | '📠'
    | '🔋'
    | '🔌'
    | '💻'
    | '🖥️'
    | '🖥'
    | '🖨️'
    | '🖨'
    | '⌨️'
    | '⌨'
    | '🖱️'
    | '🖱'
    | '🖲️'
    | '🖲'
    | '💽'
    | '💾'
    | '💿'
    | '📀'
    | '🧮'
    | '🎥'
    | '🎞️'
    | '🎞'
    | '📽️'
    | '📽'
    | '🎬'
    | '📺'
    | '📷'
    | '📸'
    | '📹'
    | '📼'
    | '🔍'
    | '🔎'
    | '🕯️'
    | '🕯'
    | '💡'
    | '🔦'
    | '🏮'
    | '🪔'
    | '📔'
    | '📕'
    | '📖'
    | '📗'
    | '📘'
    | '📙'
    | '📚'
    | '📓'
    | '📒'
    | '📃'
    | '📜'
    | '📄'
    | '📰'
    | '🗞️'
    | '🗞'
    | '📑'
    | '🔖'
    | '🏷️'
    | '🏷'
    | '💰'
    | '🪙'
    | '💴'
    | '💵'
    | '💶'
    | '💷'
    | '💸'
    | '💳'
    | '🧾'
    | '💹'
    | '✉️'
    | '✉'
    | '📧'
    | '📨'
    | '📩'
    | '📤'
    | '📥'
    | '📦'
    | '📫'
    | '📪'
    | '📬'
    | '📭'
    | '📮'
    | '🗳️'
    | '🗳'
    | '✏️'
    | '✏'
    | '✒️'
    | '✒'
    | '🖋️'
    | '🖋'
    | '🖊️'
    | '🖊'
    | '🖌️'
    | '🖌'
    | '🖍️'
    | '🖍'
    | '📝'
    | '💼'
    | '📁'
    | '📂'
    | '🗂️'
    | '🗂'
    | '📅'
    | '📆'
    | '🗒️'
    | '🗒'
    | '🗓️'
    | '🗓'
    | '📇'
    | '📈'
    | '📉'
    | '📊'
    | '📋'
    | '📌'
    | '📍'
    | '📎'
    | '🖇️'
    | '🖇'
    | '📏'
    | '📐'
    | '✂️'
    | '✂'
    | '🗃️'
    | '🗃'
    | '🗄️'
    | '🗄'
    | '🗑️'
    | '🗑'
    | '🔒'
    | '🔓'
    | '🔏'
    | '🔐'
    | '🔑'
    | '🗝️'
    | '🗝'
    | '🔨'
    | '🪓'
    | '⛏️'
    | '⛏'
    | '⚒️'
    | '⚒'
    | '🛠️'
    | '🛠'
    | '🗡️'
    | '🗡'
    | '⚔️'
    | '⚔'
    | '🔫'
    | '🪃'
    | '🏹'
    | '🛡️'
    | '🛡'
    | '🪚'
    | '🔧'
    | '🪛'
    | '🔩'
    | '⚙️'
    | '⚙'
    | '🗜️'
    | '🗜'
    | '⚖️'
    | '⚖'
    | '🦯'
    | '🔗'
    | '⛓️'
    | '⛓'
    | '🪝'
    | '🧰'
    | '🧲'
    | '🪜'
    | '⚗️'
    | '⚗'
    | '🧪'
    | '🧫'
    | '🧬'
    | '🔬'
    | '🔭'
    | '📡'
    | '💉'
    | '🩸'
    | '💊'
    | '🩹'
    | '🩺'
    | '🚪'
    | '🛗'
    | '🪞'
    | '🪟'
    | '🛏️'
    | '🛏'
    | '🛋️'
    | '🛋'
    | '🪑'
    | '🚽'
    | '🪠'
    | '🚿'
    | '🛁'
    | '🪤'
    | '🪒'
    | '🧴'
    | '🧷'
    | '🧹'
    | '🧺'
    | '🧻'
    | '🪣'
    | '🧼'
    | '🪥'
    | '🧽'
    | '🧯'
    | '🛒'
    | '🚬'
    | '⚰️'
    | '⚰'
    | '🪦'
    | '⚱️'
    | '⚱'
    | '🗿'
    | '🪧'
    | '🏧'
    | '🚮'
    | '🚰'
    | '♿'
    | '🚹'
    | '🚺'
    | '🚻'
    | '🚼'
    | '🚾'
    | '🛂'
    | '🛃'
    | '🛄'
    | '🛅'
    | '⚠️'
    | '⚠'
    | '🚸'
    | '⛔'
    | '🚫'
    | '🚳'
    | '🚭'
    | '🚯'
    | '🚱'
    | '🚷'
    | '📵'
    | '🔞'
    | '☢️'
    | '☢'
    | '☣️'
    | '☣'
    | '⬆️'
    | '⬆'
    | '↗️'
    | '↗'
    | '➡️'
    | '➡'
    | '↘️'
    | '↘'
    | '⬇️'
    | '⬇'
    | '↙️'
    | '↙'
    | '⬅️'
    | '⬅'
    | '↖️'
    | '↖'
    | '↕️'
    | '↕'
    | '↔️'
    | '↔'
    | '↩️'
    | '↩'
    | '↪️'
    | '↪'
    | '⤴️'
    | '⤴'
    | '⤵️'
    | '⤵'
    | '🔃'
    | '🔄'
    | '🔙'
    | '🔚'
    | '🔛'
    | '🔜'
    | '🔝'
    | '🛐'
    | '⚛️'
    | '⚛'
    | '🕉️'
    | '🕉'
    | '✡️'
    | '✡'
    | '☸️'
    | '☸'
    | '☯️'
    | '☯'
    | '✝️'
    | '✝'
    | '☦️'
    | '☦'
    | '☪️'
    | '☪'
    | '☮️'
    | '☮'
    | '🕎'
    | '🔯'
    | '♈'
    | '♉'
    | '♊'
    | '♋'
    | '♌'
    | '♍'
    | '♎'
    | '♏'
    | '♐'
    | '♑'
    | '♒'
    | '♓'
    | '⛎'
    | '🔀'
    | '🔁'
    | '🔂'
    | '▶️'
    | '▶'
    | '⏩'
    | '⏭️'
    | '⏭'
    | '⏯️'
    | '⏯'
    | '◀️'
    | '◀'
    | '⏪'
    | '⏮️'
    | '⏮'
    | '🔼'
    | '⏫'
    | '🔽'
    | '⏬'
    | '⏸️'
    | '⏸'
    | '⏹️'
    | '⏹'
    | '⏺️'
    | '⏺'
    | '⏏️'
    | '⏏'
    | '🎦'
    | '🔅'
    | '🔆'
    | '📶'
    | '📳'
    | '📴'
    | '♀️'
    | '♀'
    | '♂️'
    | '♂'
    | '⚧️'
    | '⚧'
    | '✖️'
    | '✖'
    | '➕'
    | '➖'
    | '➗'
    | '♾️'
    | '♾'
    | '‼️'
    | '‼'
    | '⁉️'
    | '⁉'
    | '❓'
    | '❔'
    | '❕'
    | '❗'
    | '〰️'
    | '〰'
    | '💱'
    | '💲'
    | '⚕️'
    | '⚕'
    | '♻️'
    | '♻'
    | '⚜️'
    | '⚜'
    | '🔱'
    | '📛'
    | '🔰'
    | '⭕'
    | '✅'
    | '☑️'
    | '☑'
    | '✔️'
    | '✔'
    | '❌'
    | '❎'
    | '➰'
    | '➿'
    | '〽️'
    | '〽'
    | '✳️'
    | '✳'
    | '✴️'
    | '✴'
    | '❇️'
    | '❇'
    | '©️'
    | '©'
    | '®️'
    | '®'
    | '™️'
    | '™'
    | '#️⃣'
    | '#⃣'
    | '*️⃣'
    | '*⃣'
    | '0️⃣'
    | '0⃣'
    | '1️⃣'
    | '1⃣'
    | '2️⃣'
    | '2⃣'
    | '3️⃣'
    | '3⃣'
    | '4️⃣'
    | '4⃣'
    | '5️⃣'
    | '5⃣'
    | '6️⃣'
    | '6⃣'
    | '7️⃣'
    | '7⃣'
    | '8️⃣'
    | '8⃣'
    | '9️⃣'
    | '9⃣'
    | '🔟'
    | '🔠'
    | '🔡'
    | '🔢'
    | '🔣'
    | '🔤'
    | '🅰️'
    | '🅰'
    | '🆎'
    | '🅱️'
    | '🅱'
    | '🆑'
    | '🆒'
    | '🆓'
    | 'ℹ️'
    | 'ℹ'
    | '🆔'
    | 'Ⓜ️'
    | 'Ⓜ'
    | '🆕'
    | '🆖'
    | '🅾️'
    | '🅾'
    | '🆗'
    | '🅿️'
    | '🅿'
    | '🆘'
    | '🆙'
    | '🆚'
    | '🈁'
    | '🈂️'
    | '🈂'
    | '🈷️'
    | '🈷'
    | '🈶'
    | '🈯'
    | '🉐'
    | '🈹'
    | '🈚'
    | '🈲'
    | '🉑'
    | '🈸'
    | '🈴'
    | '🈳'
    | '㊗️'
    | '㊗'
    | '㊙️'
    | '㊙'
    | '🈺'
    | '🈵'
    | '🔴'
    | '🟠'
    | '🟡'
    | '🟢'
    | '🔵'
    | '🟣'
    | '🟤'
    | '⚫'
    | '⚪'
    | '🟥'
    | '🟧'
    | '🟨'
    | '🟩'
    | '🟦'
    | '🟪'
    | '🟫'
    | '⬛'
    | '⬜'
    | '◼️'
    | '◼'
    | '◻️'
    | '◻'
    | '◾'
    | '◽'
    | '▪️'
    | '▪'
    | '▫️'
    | '▫'
    | '🔶'
    | '🔷'
    | '🔸'
    | '🔹'
    | '🔺'
    | '🔻'
    | '💠'
    | '🔘'
    | '🔳'
    | '🔲'
    | '🏁'
    | '🚩'
    | '🎌'
    | '🏴'
    | '🏳️'
    | '🏳'
    | '🏳️‍🌈'
    | '🏳‍🌈'
    | '🏳️‍⚧️'
    | '🏴‍☠️'
    | '🏴‍☠'
    | '🇦🇨'
    | '🇦🇩'
    | '🇦🇪'
    | '🇦🇫'
    | '🇦🇬'
    | '🇦🇮'
    | '🇦🇱'
    | '🇦🇲'
    | '🇦🇴'
    | '🇦🇶'
    | '🇦🇷'
    | '🇦🇸'
    | '🇦🇹'
    | '🇦🇺'
    | '🇦🇼'
    | '🇦🇽'
    | '🇦🇿'
    | '🇧🇦'
    | '🇧🇧'
    | '🇧🇩'
    | '🇧🇪'
    | '🇧🇫'
    | '🇧🇬'
    | '🇧🇭'
    | '🇧🇮'
    | '🇧🇯'
    | '🇧🇱'
    | '🇧🇲'
    | '🇧🇳'
    | '🇧🇴'
    | '🇧🇶'
    | '🇧🇷'
    | '🇧🇸'
    | '🇧🇹'
    | '🇧🇻'
    | '🇧🇼'
    | '🇧🇾'
    | '🇧🇿'
    | '🇨🇦'
    | '🇨🇨'
    | '🇨🇩'
    | '🇨🇫'
    | '🇨🇬'
    | '🇨🇭'
    | '🇨🇮'
    | '🇨🇰'
    | '🇨🇱'
    | '🇨🇲'
    | '🇨🇳'
    | '🇨🇴'
    | '🇨🇵'
    | '🇨🇷'
    | '🇨🇺'
    | '🇨🇻'
    | '🇨🇼'
    | '🇨🇽'
    | '🇨🇾'
    | '🇨🇿'
    | '🇩🇪'
    | '🇩🇬'
    | '🇩🇯'
    | '🇩🇰'
    | '🇩🇲'
    | '🇩🇴'
    | '🇩🇿'
    | '🇪🇦'
    | '🇪🇨'
    | '🇪🇪'
    | '🇪🇬'
    | '🇪🇭'
    | '🇪🇷'
    | '🇪🇸'
    | '🇪🇹'
    | '🇪🇺'
    | '🇫🇮'
    | '🇫🇯'
    | '🇫🇰'
    | '🇫🇲'
    | '🇫🇴'
    | '🇫🇷'
    | '🇬🇦'
    | '🇬🇧'
    | '🇬🇩'
    | '🇬🇪'
    | '🇬🇫'
    | '🇬🇬'
    | '🇬🇭'
    | '🇬🇮'
    | '🇬🇱'
    | '🇬🇲'
    | '🇬🇳'
    | '🇬🇵'
    | '🇬🇶'
    | '🇬🇷'
    | '🇬🇸'
    | '🇬🇹'
    | '🇬🇺'
    | '🇬🇼'
    | '🇬🇾'
    | '🇭🇰'
    | '🇭🇲'
    | '🇭🇳'
    | '🇭🇷'
    | '🇭🇹'
    | '🇭🇺'
    | '🇮🇨'
    | '🇮🇩'
    | '🇮🇪'
    | '🇮🇱'
    | '🇮🇲'
    | '🇮🇳'
    | '🇮🇴'
    | '🇮🇶'
    | '🇮🇷'
    | '🇮🇸'
    | '🇮🇹'
    | '🇯🇪'
    | '🇯🇲'
    | '🇯🇴'
    | '🇯🇵'
    | '🇰🇪'
    | '🇰🇬'
    | '🇰🇭'
    | '🇰🇮'
    | '🇰🇲'
    | '🇰🇳'
    | '🇰🇵'
    | '🇰🇷'
    | '🇰🇼'
    | '🇰🇾'
    | '🇰🇿'
    | '🇱🇦'
    | '🇱🇧'
    | '🇱🇨'
    | '🇱🇮'
    | '🇱🇰'
    | '🇱🇷'
    | '🇱🇸'
    | '🇱🇹'
    | '🇱🇺'
    | '🇱🇻'
    | '🇱🇾'
    | '🇲🇦'
    | '🇲🇨'
    | '🇲🇩'
    | '🇲🇪'
    | '🇲🇫'
    | '🇲🇬'
    | '🇲🇭'
    | '🇲🇰'
    | '🇲🇱'
    | '🇲🇲'
    | '🇲🇳'
    | '🇲🇴'
    | '🇲🇵'
    | '🇲🇶'
    | '🇲🇷'
    | '🇲🇸'
    | '🇲🇹'
    | '🇲🇺'
    | '🇲🇻'
    | '🇲🇼'
    | '🇲🇽'
    | '🇲🇾'
    | '🇲🇿'
    | '🇳🇦'
    | '🇳🇨'
    | '🇳🇪'
    | '🇳🇫'
    | '🇳🇬'
    | '🇳🇮'
    | '🇳🇱'
    | '🇳🇴'
    | '🇳🇵'
    | '🇳🇷'
    | '🇳🇺'
    | '🇳🇿'
    | '🇴🇲'
    | '🇵🇦'
    | '🇵🇪'
    | '🇵🇫'
    | '🇵🇬'
    | '🇵🇭'
    | '🇵🇰'
    | '🇵🇱'
    | '🇵🇲'
    | '🇵🇳'
    | '🇵🇷'
    | '🇵🇸'
    | '🇵🇹'
    | '🇵🇼'
    | '🇵🇾'
    | '🇶🇦'
    | '🇷🇪'
    | '🇷🇴'
    | '🇷🇸'
    | '🇷🇺'
    | '🇷🇼'
    | '🇸🇦'
    | '🇸🇧'
    | '🇸🇨'
    | '🇸🇩'
    | '🇸🇪'
    | '🇸🇬'
    | '🇸🇭'
    | '🇸🇮'
    | '🇸🇯'
    | '🇸🇰'
    | '🇸🇱'
    | '🇸🇲'
    | '🇸🇳'
    | '🇸🇴'
    | '🇸🇷'
    | '🇸🇸'
    | '🇸🇹'
    | '🇸🇻'
    | '🇸🇽'
    | '🇸🇾'
    | '🇸🇿'
    | '🇹🇦'
    | '🇹🇨'
    | '🇹🇩'
    | '🇹🇫'
    | '🇹🇬'
    | '🇹🇭'
    | '🇹🇯'
    | '🇹🇰'
    | '🇹🇱'
    | '🇹🇲'
    | '🇹🇳'
    | '🇹🇴'
    | '🇹🇷'
    | '🇹🇹'
    | '🇹🇻'
    | '🇹🇼'
    | '🇹🇿'
    | '🇺🇦'
    | '🇺🇬'
    | '🇺🇲'
    | '🇺🇳'
    | '🇺🇸'
    | '🇺🇾'
    | '🇺🇿'
    | '🇻🇦'
    | '🇻🇨'
    | '🇻🇪'
    | '🇻🇬'
    | '🇻🇮'
    | '🇻🇳'
    | '🇻🇺'
    | '🇼🇫'
    | '🇼🇸'
    | '🇽🇰'
    | '🇾🇪'
    | '🇾🇹'
    | '🇿🇦'
    | '🇿🇲'
    | '🇿🇼'
    | '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
    | '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
    | '🏴󠁧󠁢󠁷󠁬󠁳󠁿';

export type PageObjectResponse = {
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    properties: Record<
        string,
        | { type: 'number'; number: number | null; id: string }
        | { type: 'url'; url: string | null; id: string }
        | { type: 'select'; select: SelectPropertyResponse | null; id: string }
        | {
            type: 'multi_select';
            multi_select: Array<SelectPropertyResponse>;
            id: string;
        }
        | { type: 'status'; status: SelectPropertyResponse | null; id: string }
        | { type: 'date'; date: DateResponse | null; id: string }
        | { type: 'email'; email: string | null; id: string }
        | { type: 'phone_number'; phone_number: string | null; id: string }
        | { type: 'checkbox'; checkbox: boolean; id: string }
        | {
            type: 'files';
            files: Array<
                | {
                    file: { url: string; expiry_time: string };
                    name: StringRequest;
                    type?: 'file';
                }
                | {
                    external: { url: TextRequest };
                    name: StringRequest;
                    type?: 'external';
                }
            >;
            id: string;
        }
        | {
            type: 'created_by';
            created_by: PartialUserObjectResponse | UserObjectResponse;
            id: string;
        }
        | { type: 'created_time'; created_time: string; id: string }
        | {
            type: 'last_edited_by';
            last_edited_by: PartialUserObjectResponse | UserObjectResponse;
            id: string;
        }
        | { type: 'last_edited_time'; last_edited_time: string; id: string }
        | { type: 'formula'; formula: FormulaPropertyResponse; id: string }
        | { type: 'title'; title: Array<RichTextItemResponse>; id: string }
        | { type: 'rich_text'; rich_text: Array<RichTextItemResponse>; id: string }
        | {
            type: 'people';
            people: Array<PartialUserObjectResponse | UserObjectResponse>;
            id: string;
        }
        | { type: 'relation'; relation: Array<{ id: string }>; id: string }
        | {
            type: 'rollup';
            rollup:
            | { type: 'number'; number: number | null; function: RollupFunction }
            | {
                type: 'date';
                date: DateResponse | null;
                function: RollupFunction;
            }
            | {
                type: 'array';
                array: Array<
                    | { type: 'title'; title: Array<RichTextItemResponse> }
                    | { type: 'rich_text'; rich_text: Array<RichTextItemResponse> }
                    | {
                        type: 'people';
                        people: Array<PartialUserObjectResponse | UserObjectResponse>;
                    }
                    | { type: 'relation'; relation: Array<{ id: string }> }
                >;
                function: RollupFunction;
            };
            id: string;
        }
    >;
    icon:
    | { type: 'emoji'; emoji: EmojiRequest }
    | null
    | { type: 'external'; external: { url: TextRequest } }
    | null
    | { type: 'file'; file: { url: string; expiry_time: string } }
    | null;
    cover:
    | { type: 'external'; external: { url: TextRequest } }
    | null
    | { type: 'file'; file: { url: string; expiry_time: string } }
    | null;
    created_by: PartialUserObjectResponse;
    last_edited_by: PartialUserObjectResponse;
    object: 'page';
    id: string;
    created_time: string;
    last_edited_time: string;
    archived: boolean;
    url: string;
};

export type PartialPageObjectResponse = { object: 'page'; id: string };

type NumberFormat =
    | 'number'
    | 'number_with_commas'
    | 'percent'
    | 'dollar'
    | 'canadian_dollar'
    | 'euro'
    | 'pound'
    | 'yen'
    | 'ruble'
    | 'rupee'
    | 'won'
    | 'yuan'
    | 'real'
    | 'lira'
    | 'rupiah'
    | 'franc'
    | 'hong_kong_dollar'
    | 'new_zealand_dollar'
    | 'krona'
    | 'norwegian_krone'
    | 'mexican_peso'
    | 'rand'
    | 'new_taiwan_dollar'
    | 'danish_krone'
    | 'zloty'
    | 'baht'
    | 'forint'
    | 'koruna'
    | 'shekel'
    | 'chilean_peso'
    | 'philippine_peso'
    | 'dirham'
    | 'colombian_peso'
    | 'riyal'
    | 'ringgit'
    | 'leu'
    | 'argentine_peso'
    | 'uruguayan_peso';

type NumberDatabasePropertyConfigResponse = {
    type: 'number';
    number: { format: NumberFormat };
    id: string;
    name: string;
};

type FormulaDatabasePropertyConfigResponse = {
    type: 'formula';
    formula: { expression: string };
    id: string;
    name: string;
};

type SelectDatabasePropertyConfigResponse = {
    type: 'select';
    select: { options: Array<SelectPropertyResponse> };
    id: string;
    name: string;
};

type MultiSelectDatabasePropertyConfigResponse = {
    type: 'multi_select';
    multi_select: { options: Array<SelectPropertyResponse> };
    id: string;
    name: string;
};

type StatusPropertyResponse = {
    id: StringRequest;
    name: StringRequest;
    color: SelectColor;
};

type StatusDatabasePropertyConfigResponse = {
    type: 'status';
    status: {
        options: Array<StatusPropertyResponse>;
        groups: Array<{
            id: StringRequest;
            name: StringRequest;
            color: SelectColor;
            option_ids: Array<string>;
        }>;
    };
    id: string;
    name: string;
};

type SinglePropertyDatabasePropertyRelationConfigResponse = {
    type: 'single_property';
    single_property: EmptyObject;
    database_id: IdRequest;
};

type DualPropertyDatabasePropertyRelationConfigResponse = {
    type: 'dual_property';
    dual_property: {
        synced_property_id: StringRequest;
        synced_property_name: StringRequest;
    };
    database_id: IdRequest;
};

type DatabasePropertyRelationConfigResponse =
    | SinglePropertyDatabasePropertyRelationConfigResponse
    | DualPropertyDatabasePropertyRelationConfigResponse;

type RelationDatabasePropertyConfigResponse = {
    type: 'relation';
    relation: DatabasePropertyRelationConfigResponse;
    id: string;
    name: string;
};

type RollupDatabasePropertyConfigResponse = {
    type: 'rollup';
    rollup: {
        rollup_property_name: string;
        relation_property_name: string;
        rollup_property_id: string;
        relation_property_id: string;
        function: RollupFunction;
    };
    id: string;
    name: string;
};

type TitleDatabasePropertyConfigResponse = {
    type: 'title';
    title: EmptyObject;
    id: string;
    name: string;
};

type RichTextDatabasePropertyConfigResponse = {
    type: 'rich_text';
    rich_text: EmptyObject;
    id: string;
    name: string;
};

type UrlDatabasePropertyConfigResponse = {
    type: 'url';
    url: EmptyObject;
    id: string;
    name: string;
};

type PeopleDatabasePropertyConfigResponse = {
    type: 'people';
    people: EmptyObject;
    id: string;
    name: string;
};

type FilesDatabasePropertyConfigResponse = {
    type: 'files';
    files: EmptyObject;
    id: string;
    name: string;
};

type EmailDatabasePropertyConfigResponse = {
    type: 'email';
    email: EmptyObject;
    id: string;
    name: string;
};

type PhoneNumberDatabasePropertyConfigResponse = {
    type: 'phone_number';
    phone_number: EmptyObject;
    id: string;
    name: string;
};

type DateDatabasePropertyConfigResponse = {
    type: 'date';
    date: EmptyObject;
    id: string;
    name: string;
};

type CheckboxDatabasePropertyConfigResponse = {
    type: 'checkbox';
    checkbox: EmptyObject;
    id: string;
    name: string;
};

type CreatedByDatabasePropertyConfigResponse = {
    type: 'created_by';
    created_by: EmptyObject;
    id: string;
    name: string;
};

type CreatedTimeDatabasePropertyConfigResponse = {
    type: 'created_time';
    created_time: EmptyObject;
    id: string;
    name: string;
};

type LastEditedByDatabasePropertyConfigResponse = {
    type: 'last_edited_by';
    last_edited_by: EmptyObject;
    id: string;
    name: string;
};

type LastEditedTimeDatabasePropertyConfigResponse = {
    type: 'last_edited_time';
    last_edited_time: EmptyObject;
    id: string;
    name: string;
};

type DatabasePropertyConfigResponse =
    | NumberDatabasePropertyConfigResponse
    | FormulaDatabasePropertyConfigResponse
    | SelectDatabasePropertyConfigResponse
    | MultiSelectDatabasePropertyConfigResponse
    | StatusDatabasePropertyConfigResponse
    | RelationDatabasePropertyConfigResponse
    | RollupDatabasePropertyConfigResponse
    | TitleDatabasePropertyConfigResponse
    | RichTextDatabasePropertyConfigResponse
    | UrlDatabasePropertyConfigResponse
    | PeopleDatabasePropertyConfigResponse
    | FilesDatabasePropertyConfigResponse
    | EmailDatabasePropertyConfigResponse
    | PhoneNumberDatabasePropertyConfigResponse
    | DateDatabasePropertyConfigResponse
    | CheckboxDatabasePropertyConfigResponse
    | CreatedByDatabasePropertyConfigResponse
    | CreatedTimeDatabasePropertyConfigResponse
    | LastEditedByDatabasePropertyConfigResponse
    | LastEditedTimeDatabasePropertyConfigResponse;

export type PartialDatabaseObjectResponse = {
    object: 'database';
    id: string;
    properties: Record<string, DatabasePropertyConfigResponse>;
};

export type DatabaseObjectResponse = {
    title: Array<RichTextItemResponse>;
    description: Array<RichTextItemResponse>;
    icon:
    | { type: 'emoji'; emoji: EmojiRequest }
    | null
    | { type: 'external'; external: { url: TextRequest } }
    | null
    | { type: 'file'; file: { url: string; expiry_time: string } }
    | null;
    cover:
    | { type: 'external'; external: { url: TextRequest } }
    | null
    | { type: 'file'; file: { url: string; expiry_time: string } }
    | null;
    properties: Record<string, DatabasePropertyConfigResponse>;
    parent:
    | { type: 'page_id'; page_id: string }
    | { type: 'workspace'; workspace: true }
    | { type: 'block_id'; block_id: string };
    created_by: PartialUserObjectResponse;
    last_edited_by: PartialUserObjectResponse;
    is_inline: boolean;
    object: 'database';
    id: string;
    created_time: string;
    last_edited_time: string;
    archived: boolean;
    url: string;
};

export type PartialBlockObjectResponse = { object: 'block'; id: string };

type ApiColor =
    | 'default'
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'gray_background'
    | 'brown_background'
    | 'orange_background'
    | 'yellow_background'
    | 'green_background'
    | 'blue_background'
    | 'purple_background'
    | 'pink_background'
    | 'red_background';

export type ParagraphBlockObjectResponse = {
    type: 'paragraph';
    paragraph: { rich_text: Array<RichTextItemResponse>; color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type Heading1BlockObjectResponse = {
    type: 'heading_1';
    heading_1: { rich_text: Array<RichTextItemResponse>; color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type Heading2BlockObjectResponse = {
    type: 'heading_2';
    heading_2: { rich_text: Array<RichTextItemResponse>; color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type Heading3BlockObjectResponse = {
    type: 'heading_3';
    heading_3: { rich_text: Array<RichTextItemResponse>; color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type BulletedListItemBlockObjectResponse = {
    type: 'bulleted_list_item';
    bulleted_list_item: {
        rich_text: Array<RichTextItemResponse>;
        color: ApiColor;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type NumberedListItemBlockObjectResponse = {
    type: 'numbered_list_item';
    numbered_list_item: {
        rich_text: Array<RichTextItemResponse>;
        color: ApiColor;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type QuoteBlockObjectResponse = {
    type: 'quote';
    quote: { rich_text: Array<RichTextItemResponse>; color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ToDoBlockObjectResponse = {
    type: 'to_do';
    to_do: {
        rich_text: Array<RichTextItemResponse>;
        color: ApiColor;
        checked: boolean;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ToggleBlockObjectResponse = {
    type: 'toggle';
    toggle: { rich_text: Array<RichTextItemResponse>; color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type TemplateBlockObjectResponse = {
    type: 'template';
    template: { rich_text: Array<RichTextItemResponse> };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type SyncedBlockBlockObjectResponse = {
    type: 'synced_block';
    synced_block: {
        synced_from: { type: 'block_id'; block_id: IdRequest } | null;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ChildPageBlockObjectResponse = {
    type: 'child_page';
    child_page: { title: string };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ChildDatabaseBlockObjectResponse = {
    type: 'child_database';
    child_database: { title: string };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type EquationBlockObjectResponse = {
    type: 'equation';
    equation: { expression: string };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

type LanguageRequest =
    | 'abap'
    | 'agda'
    | 'arduino'
    | 'assembly'
    | 'bash'
    | 'basic'
    | 'bnf'
    | 'c'
    | 'c#'
    | 'c++'
    | 'clojure'
    | 'coffeescript'
    | 'coq'
    | 'css'
    | 'dart'
    | 'dhall'
    | 'diff'
    | 'docker'
    | 'ebnf'
    | 'elixir'
    | 'elm'
    | 'erlang'
    | 'f#'
    | 'flow'
    | 'fortran'
    | 'gherkin'
    | 'glsl'
    | 'go'
    | 'graphql'
    | 'groovy'
    | 'haskell'
    | 'html'
    | 'idris'
    | 'java'
    | 'javascript'
    | 'json'
    | 'julia'
    | 'kotlin'
    | 'latex'
    | 'less'
    | 'lisp'
    | 'livescript'
    | 'llvm ir'
    | 'lua'
    | 'makefile'
    | 'markdown'
    | 'markup'
    | 'matlab'
    | 'mathematica'
    | 'mermaid'
    | 'nix'
    | 'objective-c'
    | 'ocaml'
    | 'pascal'
    | 'perl'
    | 'php'
    | 'plain text'
    | 'powershell'
    | 'prolog'
    | 'protobuf'
    | 'purescript'
    | 'python'
    | 'r'
    | 'racket'
    | 'reason'
    | 'ruby'
    | 'rust'
    | 'sass'
    | 'scala'
    | 'scheme'
    | 'scss'
    | 'shell'
    | 'solidity'
    | 'sql'
    | 'swift'
    | 'toml'
    | 'typescript'
    | 'vb.net'
    | 'verilog'
    | 'vhdl'
    | 'visual basic'
    | 'webassembly'
    | 'xml'
    | 'yaml'
    | 'java/c/c++/c#';

export type CodeBlockObjectResponse = {
    type: 'code';
    code: {
        rich_text: Array<RichTextItemResponse>;
        caption: Array<RichTextItemResponse>;
        language: LanguageRequest;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type CalloutBlockObjectResponse = {
    type: 'callout';
    callout: {
        rich_text: Array<RichTextItemResponse>;
        color: ApiColor;
        icon:
        | { type: 'emoji'; emoji: EmojiRequest }
        | null
        | { type: 'external'; external: { url: TextRequest } }
        | null
        | { type: 'file'; file: { url: string; expiry_time: string } }
        | null;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type DividerBlockObjectResponse = {
    type: 'divider';
    divider: EmptyObject;
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type BreadcrumbBlockObjectResponse = {
    type: 'breadcrumb';
    breadcrumb: EmptyObject;
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type TableOfContentsBlockObjectResponse = {
    type: 'table_of_contents';
    table_of_contents: { color: ApiColor };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ColumnListBlockObjectResponse = {
    type: 'column_list';
    column_list: EmptyObject;
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ColumnBlockObjectResponse = {
    type: 'column';
    column: EmptyObject;
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type LinkToPageBlockObjectResponse = {
    type: 'link_to_page';
    link_to_page: { type: 'page_id'; page_id: IdRequest } | { type: 'database_id'; database_id: IdRequest };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type TableBlockObjectResponse = {
    type: 'table';
    table: {
        has_column_header: boolean;
        has_row_header: boolean;
        table_width: number;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type TableRowBlockObjectResponse = {
    type: 'table_row';
    table_row: { cells: Array<Array<RichTextItemResponse>> };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type EmbedBlockObjectResponse = {
    type: 'embed';
    embed: { url: string; caption: Array<RichTextItemResponse> };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type BookmarkBlockObjectResponse = {
    type: 'bookmark';
    bookmark: { url: string; caption: Array<RichTextItemResponse> };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type ImageBlockObjectResponse = {
    type: 'image';
    image:
    | {
        type: 'external';
        external: { url: TextRequest };
        caption: Array<RichTextItemResponse>;
    }
    | {
        type: 'file';
        file: { url: string; expiry_time: string };
        caption: Array<RichTextItemResponse>;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type VideoBlockObjectResponse = {
    type: 'video';
    video:
    | {
        type: 'external';
        external: { url: TextRequest };
        caption: Array<RichTextItemResponse>;
    }
    | {
        type: 'file';
        file: { url: string; expiry_time: string };
        caption: Array<RichTextItemResponse>;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type PdfBlockObjectResponse = {
    type: 'pdf';
    pdf:
    | {
        type: 'external';
        external: { url: TextRequest };
        caption: Array<RichTextItemResponse>;
    }
    | {
        type: 'file';
        file: { url: string; expiry_time: string };
        caption: Array<RichTextItemResponse>;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type FileBlockObjectResponse = {
    type: 'file';
    file:
    | {
        type: 'external';
        external: { url: TextRequest };
        caption: Array<RichTextItemResponse>;
    }
    | {
        type: 'file';
        file: { url: string; expiry_time: string };
        caption: Array<RichTextItemResponse>;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type AudioBlockObjectResponse = {
    type: 'audio';
    audio:
    | {
        type: 'external';
        external: { url: TextRequest };
        caption: Array<RichTextItemResponse>;
    }
    | {
        type: 'file';
        file: { url: string; expiry_time: string };
        caption: Array<RichTextItemResponse>;
    };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type LinkPreviewBlockObjectResponse = {
    type: 'link_preview';
    link_preview: { url: TextRequest };
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type UnsupportedBlockObjectResponse = {
    type: 'unsupported';
    unsupported: EmptyObject;
    parent:
    | { type: 'database_id'; database_id: string }
    | { type: 'page_id'; page_id: string }
    | { type: 'block_id'; block_id: string }
    | { type: 'workspace'; workspace: true };
    object: 'block';
    id: string;
    created_time: string;
    created_by: PartialUserObjectResponse;
    last_edited_time: string;
    last_edited_by: PartialUserObjectResponse;
    has_children: boolean;
    archived: boolean;
};

export type BlockObjectResponse =
    | ParagraphBlockObjectResponse
    | Heading1BlockObjectResponse
    | Heading2BlockObjectResponse
    | Heading3BlockObjectResponse
    | BulletedListItemBlockObjectResponse
    | NumberedListItemBlockObjectResponse
    | QuoteBlockObjectResponse
    | ToDoBlockObjectResponse
    | ToggleBlockObjectResponse
    | TemplateBlockObjectResponse
    | SyncedBlockBlockObjectResponse
    | ChildPageBlockObjectResponse
    | ChildDatabaseBlockObjectResponse
    | EquationBlockObjectResponse
    | CodeBlockObjectResponse
    | CalloutBlockObjectResponse
    | DividerBlockObjectResponse
    | BreadcrumbBlockObjectResponse
    | TableOfContentsBlockObjectResponse
    | ColumnListBlockObjectResponse
    | ColumnBlockObjectResponse
    | LinkToPageBlockObjectResponse
    | TableBlockObjectResponse
    | TableRowBlockObjectResponse
    | EmbedBlockObjectResponse
    | BookmarkBlockObjectResponse
    | ImageBlockObjectResponse
    | VideoBlockObjectResponse
    | PdfBlockObjectResponse
    | FileBlockObjectResponse
    | AudioBlockObjectResponse
    | LinkPreviewBlockObjectResponse
    | UnsupportedBlockObjectResponse;

export type NumberPropertyItemObjectResponse = {
    type: 'number';
    number: number | null;
    object: 'property_item';
    id: string;
};

export type UrlPropertyItemObjectResponse = {
    type: 'url';
    url: string | null;
    object: 'property_item';
    id: string;
};

export type SelectPropertyItemObjectResponse = {
    type: 'select';
    select: SelectPropertyResponse | null;
    object: 'property_item';
    id: string;
};

export type MultiSelectPropertyItemObjectResponse = {
    type: 'multi_select';
    multi_select: Array<SelectPropertyResponse>;
    object: 'property_item';
    id: string;
};

export type StatusPropertyItemObjectResponse = {
    type: 'status';
    status: SelectPropertyResponse | null;
    object: 'property_item';
    id: string;
};

export type DatePropertyItemObjectResponse = {
    type: 'date';
    date: DateResponse | null;
    object: 'property_item';
    id: string;
};

export type EmailPropertyItemObjectResponse = {
    type: 'email';
    email: string | null;
    object: 'property_item';
    id: string;
};

export type PhoneNumberPropertyItemObjectResponse = {
    type: 'phone_number';
    phone_number: string | null;
    object: 'property_item';
    id: string;
};

export type CheckboxPropertyItemObjectResponse = {
    type: 'checkbox';
    checkbox: boolean;
    object: 'property_item';
    id: string;
};

export type FilesPropertyItemObjectResponse = {
    type: 'files';
    files: Array<
        | {
            file: { url: string; expiry_time: string };
            name: StringRequest;
            type?: 'file';
        }
        | { external: { url: TextRequest }; name: StringRequest; type?: 'external' }
    >;
    object: 'property_item';
    id: string;
};

export type CreatedByPropertyItemObjectResponse = {
    type: 'created_by';
    created_by: PartialUserObjectResponse | UserObjectResponse;
    object: 'property_item';
    id: string;
};

export type CreatedTimePropertyItemObjectResponse = {
    type: 'created_time';
    created_time: string;
    object: 'property_item';
    id: string;
};

export type LastEditedByPropertyItemObjectResponse = {
    type: 'last_edited_by';
    last_edited_by: PartialUserObjectResponse | UserObjectResponse;
    object: 'property_item';
    id: string;
};

export type LastEditedTimePropertyItemObjectResponse = {
    type: 'last_edited_time';
    last_edited_time: string;
    object: 'property_item';
    id: string;
};

export type FormulaPropertyItemObjectResponse = {
    type: 'formula';
    formula: FormulaPropertyResponse;
    object: 'property_item';
    id: string;
};

export type TitlePropertyItemObjectResponse = {
    type: 'title';
    title: RichTextItemResponse;
    object: 'property_item';
    id: string;
};

export type RichTextPropertyItemObjectResponse = {
    type: 'rich_text';
    rich_text: RichTextItemResponse;
    object: 'property_item';
    id: string;
};

export type PeoplePropertyItemObjectResponse = {
    type: 'people';
    people: PartialUserObjectResponse | UserObjectResponse;
    object: 'property_item';
    id: string;
};

export type RelationPropertyItemObjectResponse = {
    type: 'relation';
    relation: { id: string };
    object: 'property_item';
    id: string;
};

export type RollupPropertyItemObjectResponse = {
    type: 'rollup';
    rollup:
    | { type: 'number'; number: number | null; function: RollupFunction }
    | { type: 'date'; date: DateResponse | null; function: RollupFunction }
    | { type: 'array'; array: Array<EmptyObject>; function: RollupFunction }
    | {
        type: 'unsupported';
        unsupported: EmptyObject;
        function: RollupFunction;
    }
    | { type: 'incomplete'; incomplete: EmptyObject; function: RollupFunction };
    object: 'property_item';
    id: string;
};

export type PropertyItemObjectResponse =
    | NumberPropertyItemObjectResponse
    | UrlPropertyItemObjectResponse
    | SelectPropertyItemObjectResponse
    | MultiSelectPropertyItemObjectResponse
    | StatusPropertyItemObjectResponse
    | DatePropertyItemObjectResponse
    | EmailPropertyItemObjectResponse
    | PhoneNumberPropertyItemObjectResponse
    | CheckboxPropertyItemObjectResponse
    | FilesPropertyItemObjectResponse
    | CreatedByPropertyItemObjectResponse
    | CreatedTimePropertyItemObjectResponse
    | LastEditedByPropertyItemObjectResponse
    | LastEditedTimePropertyItemObjectResponse
    | FormulaPropertyItemObjectResponse
    | TitlePropertyItemObjectResponse
    | RichTextPropertyItemObjectResponse
    | PeoplePropertyItemObjectResponse
    | RelationPropertyItemObjectResponse
    | RollupPropertyItemObjectResponse;

export type CommentObjectResponse = {
    object: 'comment';
    id: string;
    parent: { type: 'page_id'; page_id: IdRequest } | { type: 'block_id'; block_id: IdRequest };
    discussion_id: string;
    rich_text: Array<RichTextItemResponse>;
    created_by: PartialUserObjectResponse;
    created_time: string;
    last_edited_time: string;
};

export type PartialCommentObjectResponse = { object: 'comment'; id: string };

export type PropertyItemPropertyItemListResponse = {
    type: 'property_item';
    property_item:
    | { type: 'title'; title: EmptyObject; next_url: string | null; id: string }
    | {
        type: 'rich_text';
        rich_text: EmptyObject;
        next_url: string | null;
        id: string;
    }
    | {
        type: 'people';
        people: EmptyObject;
        next_url: string | null;
        id: string;
    }
    | {
        type: 'relation';
        relation: EmptyObject;
        next_url: string | null;
        id: string;
    }
    | {
        type: 'rollup';
        rollup:
        | { type: 'number'; number: number | null; function: RollupFunction }
        | {
            type: 'date';
            date: DateResponse | null;
            function: RollupFunction;
        }
        | {
            type: 'array';
            array: Array<EmptyObject>;
            function: RollupFunction;
        }
        | {
            type: 'unsupported';
            unsupported: EmptyObject;
            function: RollupFunction;
        }
        | {
            type: 'incomplete';
            incomplete: EmptyObject;
            function: RollupFunction;
        };
        next_url: string | null;
        id: string;
    };
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<PropertyItemObjectResponse>;
};

export type PropertyItemListResponse = PropertyItemPropertyItemListResponse;

type DateRequest = {
    start: string;
    end?: string | null;
    time_zone?: TimeZoneRequest | null;
};

type RichTextItemRequest =
    | {
        text: { content: string; link?: { url: TextRequest } | null };
        type?: 'text';
        annotations?: {
            bold?: boolean;
            italic?: boolean;
            strikethrough?: boolean;
            underline?: boolean;
            code?: boolean;
            color?:
            | 'default'
            | 'gray'
            | 'brown'
            | 'orange'
            | 'yellow'
            | 'green'
            | 'blue'
            | 'purple'
            | 'pink'
            | 'red'
            | 'gray_background'
            | 'brown_background'
            | 'orange_background'
            | 'yellow_background'
            | 'green_background'
            | 'blue_background'
            | 'purple_background'
            | 'pink_background'
            | 'red_background';
        };
    }
    | {
        mention:
        | {
            user:
            | { id: IdRequest }
            | {
                person: { email?: string };
                id: IdRequest;
                type?: 'person';
                name?: string | null;
                avatar_url?: string | null;
                object?: 'user';
            }
            | {
                bot:
                | EmptyObject
                | {
                    owner:
                    | {
                        type: 'user';
                        user:
                        | {
                            type: 'person';
                            person: { email: string };
                            name: string | null;
                            avatar_url: string | null;
                            id: IdRequest;
                            object: 'user';
                        }
                        | PartialUserObjectResponse;
                    }
                    | { type: 'workspace'; workspace: true };
                };
                id: IdRequest;
                type?: 'bot';
                name?: string | null;
                avatar_url?: string | null;
                object?: 'user';
            };
        }
        | { date: DateRequest }
        | { page: { id: IdRequest } }
        | { database: { id: IdRequest } };
        type?: 'mention';
        annotations?: {
            bold?: boolean;
            italic?: boolean;
            strikethrough?: boolean;
            underline?: boolean;
            code?: boolean;
            color?:
            | 'default'
            | 'gray'
            | 'brown'
            | 'orange'
            | 'yellow'
            | 'green'
            | 'blue'
            | 'purple'
            | 'pink'
            | 'red'
            | 'gray_background'
            | 'brown_background'
            | 'orange_background'
            | 'yellow_background'
            | 'green_background'
            | 'blue_background'
            | 'purple_background'
            | 'pink_background'
            | 'red_background';
        };
    }
    | {
        equation: { expression: TextRequest };
        type?: 'equation';
        annotations?: {
            bold?: boolean;
            italic?: boolean;
            strikethrough?: boolean;
            underline?: boolean;
            code?: boolean;
            color?:
            | 'default'
            | 'gray'
            | 'brown'
            | 'orange'
            | 'yellow'
            | 'green'
            | 'blue'
            | 'purple'
            | 'pink'
            | 'red'
            | 'gray_background'
            | 'brown_background'
            | 'orange_background'
            | 'yellow_background'
            | 'green_background'
            | 'blue_background'
            | 'purple_background'
            | 'pink_background'
            | 'red_background';
        };
    };

type BlockObjectRequestWithoutChildren =
    | {
        embed: { url: string; caption?: Array<RichTextItemRequest> };
        type?: 'embed';
        object?: 'block';
    }
    | {
        bookmark: { url: string; caption?: Array<RichTextItemRequest> };
        type?: 'bookmark';
        object?: 'block';
    }
    | {
        image: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'image';
        object?: 'block';
    }
    | {
        video: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'video';
        object?: 'block';
    }
    | {
        pdf: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'pdf';
        object?: 'block';
    }
    | {
        file: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'file';
        object?: 'block';
    }
    | {
        audio: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'audio';
        object?: 'block';
    }
    | {
        code: {
            rich_text: Array<RichTextItemRequest>;
            language: LanguageRequest;
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'code';
        object?: 'block';
    }
    | { equation: { expression: string }; type?: 'equation'; object?: 'block' }
    | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
    | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
    | {
        table_of_contents: { color?: ApiColor };
        type?: 'table_of_contents';
        object?: 'block';
    }
    | {
        link_to_page: { page_id: IdRequest; type?: 'page_id' } | { database_id: IdRequest; type?: 'database_id' };
        type?: 'link_to_page';
        object?: 'block';
    }
    | {
        table_row: { cells: Array<Array<RichTextItemRequest>> };
        type?: 'table_row';
        object?: 'block';
    }
    | {
        heading_1: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
        };
        type?: 'heading_1';
        object?: 'block';
    }
    | {
        heading_2: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
        };
        type?: 'heading_2';
        object?: 'block';
    }
    | {
        heading_3: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
        };
        type?: 'heading_3';
        object?: 'block';
    }
    | {
        paragraph: { rich_text: Array<RichTextItemRequest>; color?: ApiColor };
        type?: 'paragraph';
        object?: 'block';
    }
    | {
        bulleted_list_item: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
        };
        type?: 'bulleted_list_item';
        object?: 'block';
    }
    | {
        numbered_list_item: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
        };
        type?: 'numbered_list_item';
        object?: 'block';
    }
    | {
        quote: { rich_text: Array<RichTextItemRequest>; color?: ApiColor };
        type?: 'quote';
        object?: 'block';
    }
    | {
        to_do: {
            rich_text: Array<RichTextItemRequest>;
            checked?: boolean;
            color?: ApiColor;
        };
        type?: 'to_do';
        object?: 'block';
    }
    | {
        toggle: { rich_text: Array<RichTextItemRequest>; color?: ApiColor };
        type?: 'toggle';
        object?: 'block';
    }
    | {
        template: { rich_text: Array<RichTextItemRequest> };
        type?: 'template';
        object?: 'block';
    }
    | {
        callout: {
            rich_text: Array<RichTextItemRequest>;
            icon?: { emoji: EmojiRequest; type?: 'emoji' } | { external: { url: TextRequest }; type?: 'external' };
            color?: ApiColor;
        };
        type?: 'callout';
        object?: 'block';
    }
    | {
        synced_block: {
            synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
        };
        type?: 'synced_block';
        object?: 'block';
    };

type BlockObjectRequest =
    | {
        embed: { url: string; caption?: Array<RichTextItemRequest> };
        type?: 'embed';
        object?: 'block';
    }
    | {
        bookmark: { url: string; caption?: Array<RichTextItemRequest> };
        type?: 'bookmark';
        object?: 'block';
    }
    | {
        image: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'image';
        object?: 'block';
    }
    | {
        video: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'video';
        object?: 'block';
    }
    | {
        pdf: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'pdf';
        object?: 'block';
    }
    | {
        file: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'file';
        object?: 'block';
    }
    | {
        audio: {
            external: { url: TextRequest };
            type?: 'external';
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'audio';
        object?: 'block';
    }
    | {
        code: {
            rich_text: Array<RichTextItemRequest>;
            language: LanguageRequest;
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'code';
        object?: 'block';
    }
    | { equation: { expression: string }; type?: 'equation'; object?: 'block' }
    | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
    | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
    | {
        table_of_contents: { color?: ApiColor };
        type?: 'table_of_contents';
        object?: 'block';
    }
    | {
        link_to_page: { page_id: IdRequest; type?: 'page_id' } | { database_id: IdRequest; type?: 'database_id' };
        type?: 'link_to_page';
        object?: 'block';
    }
    | {
        table_row: { cells: Array<Array<RichTextItemRequest>> };
        type?: 'table_row';
        object?: 'block';
    }
    | {
        column_list: {
            children: Array<{
                column: {
                    children: Array<
                        | {
                            embed: { url: string; caption?: Array<RichTextItemRequest> };
                            type?: 'embed';
                            object?: 'block';
                        }
                        | {
                            bookmark: {
                                url: string;
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'bookmark';
                            object?: 'block';
                        }
                        | {
                            image: {
                                external: { url: TextRequest };
                                type?: 'external';
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'image';
                            object?: 'block';
                        }
                        | {
                            video: {
                                external: { url: TextRequest };
                                type?: 'external';
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'video';
                            object?: 'block';
                        }
                        | {
                            pdf: {
                                external: { url: TextRequest };
                                type?: 'external';
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'pdf';
                            object?: 'block';
                        }
                        | {
                            file: {
                                external: { url: TextRequest };
                                type?: 'external';
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'file';
                            object?: 'block';
                        }
                        | {
                            audio: {
                                external: { url: TextRequest };
                                type?: 'external';
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'audio';
                            object?: 'block';
                        }
                        | {
                            code: {
                                rich_text: Array<RichTextItemRequest>;
                                language: LanguageRequest;
                                caption?: Array<RichTextItemRequest>;
                            };
                            type?: 'code';
                            object?: 'block';
                        }
                        | {
                            equation: { expression: string };
                            type?: 'equation';
                            object?: 'block';
                        }
                        | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                        | {
                            breadcrumb: EmptyObject;
                            type?: 'breadcrumb';
                            object?: 'block';
                        }
                        | {
                            table_of_contents: { color?: ApiColor };
                            type?: 'table_of_contents';
                            object?: 'block';
                        }
                        | {
                            link_to_page:
                            | { page_id: IdRequest; type?: 'page_id' }
                            | { database_id: IdRequest; type?: 'database_id' };
                            type?: 'link_to_page';
                            object?: 'block';
                        }
                        | {
                            table_row: { cells: Array<Array<RichTextItemRequest>> };
                            type?: 'table_row';
                            object?: 'block';
                        }
                        | {
                            heading_1: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                is_toggleable?: boolean;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'heading_1';
                            object?: 'block';
                        }
                        | {
                            heading_2: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                is_toggleable?: boolean;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'heading_2';
                            object?: 'block';
                        }
                        | {
                            heading_3: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                is_toggleable?: boolean;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'heading_3';
                            object?: 'block';
                        }
                        | {
                            paragraph: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'paragraph';
                            object?: 'block';
                        }
                        | {
                            bulleted_list_item: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'bulleted_list_item';
                            object?: 'block';
                        }
                        | {
                            numbered_list_item: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'numbered_list_item';
                            object?: 'block';
                        }
                        | {
                            quote: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'quote';
                            object?: 'block';
                        }
                        | {
                            to_do: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                                checked?: boolean;
                            };
                            type?: 'to_do';
                            object?: 'block';
                        }
                        | {
                            toggle: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'toggle';
                            object?: 'block';
                        }
                        | {
                            template: {
                                rich_text: Array<RichTextItemRequest>;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'template';
                            object?: 'block';
                        }
                        | {
                            callout: {
                                rich_text: Array<RichTextItemRequest>;
                                color?: ApiColor;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                                icon?:
                                | { emoji: EmojiRequest; type?: 'emoji' }
                                | { external: { url: TextRequest }; type?: 'external' };
                            };
                            type?: 'callout';
                            object?: 'block';
                        }
                        | {
                            synced_block: {
                                synced_from: {
                                    block_id: IdRequest;
                                    type?: 'block_id';
                                } | null;
                                children?: Array<BlockObjectRequestWithoutChildren>;
                            };
                            type?: 'synced_block';
                            object?: 'block';
                        }
                    >;
                };
                type?: 'column';
                object?: 'block';
            }>;
        };
        type?: 'column_list';
        object?: 'block';
    }
    | {
        column: {
            children: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'column';
        object?: 'block';
    }
    | {
        table: {
            table_width: number;
            children: Array<BlockObjectRequestWithoutChildren>;
            has_column_header?: boolean;
            has_row_header?: boolean;
        };
        type?: 'table';
        object?: 'block';
    }
    | {
        heading_1: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'heading_1';
        object?: 'block';
    }
    | {
        heading_2: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'heading_2';
        object?: 'block';
    }
    | {
        heading_3: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'heading_3';
        object?: 'block';
    }
    | {
        paragraph: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'paragraph';
        object?: 'block';
    }
    | {
        bulleted_list_item: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'bulleted_list_item';
        object?: 'block';
    }
    | {
        numbered_list_item: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'numbered_list_item';
        object?: 'block';
    }
    | {
        quote: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'quote';
        object?: 'block';
    }
    | {
        to_do: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
            checked?: boolean;
        };
        type?: 'to_do';
        object?: 'block';
    }
    | {
        toggle: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'toggle';
        object?: 'block';
    }
    | {
        template: {
            rich_text: Array<RichTextItemRequest>;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'template';
        object?: 'block';
    }
    | {
        callout: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
            icon?: { emoji: EmojiRequest; type?: 'emoji' } | { external: { url: TextRequest }; type?: 'external' };
        };
        type?: 'callout';
        object?: 'block';
    }
    | {
        synced_block: {
            synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
            children?: Array<
                | {
                    embed: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'embed';
                    object?: 'block';
                }
                | {
                    bookmark: { url: string; caption?: Array<RichTextItemRequest> };
                    type?: 'bookmark';
                    object?: 'block';
                }
                | {
                    image: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'image';
                    object?: 'block';
                }
                | {
                    video: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'video';
                    object?: 'block';
                }
                | {
                    pdf: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'pdf';
                    object?: 'block';
                }
                | {
                    file: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'file';
                    object?: 'block';
                }
                | {
                    audio: {
                        external: { url: TextRequest };
                        type?: 'external';
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'audio';
                    object?: 'block';
                }
                | {
                    code: {
                        rich_text: Array<RichTextItemRequest>;
                        language: LanguageRequest;
                        caption?: Array<RichTextItemRequest>;
                    };
                    type?: 'code';
                    object?: 'block';
                }
                | {
                    equation: { expression: string };
                    type?: 'equation';
                    object?: 'block';
                }
                | { divider: EmptyObject; type?: 'divider'; object?: 'block' }
                | { breadcrumb: EmptyObject; type?: 'breadcrumb'; object?: 'block' }
                | {
                    table_of_contents: { color?: ApiColor };
                    type?: 'table_of_contents';
                    object?: 'block';
                }
                | {
                    link_to_page:
                    | { page_id: IdRequest; type?: 'page_id' }
                    | { database_id: IdRequest; type?: 'database_id' };
                    type?: 'link_to_page';
                    object?: 'block';
                }
                | {
                    table_row: { cells: Array<Array<RichTextItemRequest>> };
                    type?: 'table_row';
                    object?: 'block';
                }
                | {
                    heading_1: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_1';
                    object?: 'block';
                }
                | {
                    heading_2: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_2';
                    object?: 'block';
                }
                | {
                    heading_3: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        is_toggleable?: boolean;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'heading_3';
                    object?: 'block';
                }
                | {
                    paragraph: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'paragraph';
                    object?: 'block';
                }
                | {
                    bulleted_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'bulleted_list_item';
                    object?: 'block';
                }
                | {
                    numbered_list_item: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'numbered_list_item';
                    object?: 'block';
                }
                | {
                    quote: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'quote';
                    object?: 'block';
                }
                | {
                    to_do: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        checked?: boolean;
                    };
                    type?: 'to_do';
                    object?: 'block';
                }
                | {
                    toggle: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'toggle';
                    object?: 'block';
                }
                | {
                    template: {
                        rich_text: Array<RichTextItemRequest>;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'template';
                    object?: 'block';
                }
                | {
                    callout: {
                        rich_text: Array<RichTextItemRequest>;
                        color?: ApiColor;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                        icon?:
                        | { emoji: EmojiRequest; type?: 'emoji' }
                        | { external: { url: TextRequest }; type?: 'external' };
                    };
                    type?: 'callout';
                    object?: 'block';
                }
                | {
                    synced_block: {
                        synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
                        children?: Array<BlockObjectRequestWithoutChildren>;
                    };
                    type?: 'synced_block';
                    object?: 'block';
                }
            >;
        };
        type?: 'synced_block';
        object?: 'block';
    };

type ExistencePropertyFilter = { is_empty: true } | { is_not_empty: true };

type TextPropertyFilter =
    | { equals: string }
    | { does_not_equal: string }
    | { contains: string }
    | { does_not_contain: string }
    | { starts_with: string }
    | { ends_with: string }
    | ExistencePropertyFilter;

type NumberPropertyFilter =
    | { equals: number }
    | { does_not_equal: number }
    | { greater_than: number }
    | { less_than: number }
    | { greater_than_or_equal_to: number }
    | { less_than_or_equal_to: number }
    | ExistencePropertyFilter;

type CheckboxPropertyFilter = { equals: boolean } | { does_not_equal: boolean };

type SelectPropertyFilter = { equals: string } | { does_not_equal: string } | ExistencePropertyFilter;

type MultiSelectPropertyFilter = { contains: string } | { does_not_contain: string } | ExistencePropertyFilter;

type StatusPropertyFilter = { equals: string } | { does_not_equal: string } | ExistencePropertyFilter;

type DatePropertyFilter =
    | { equals: string }
    | { before: string }
    | { after: string }
    | { on_or_before: string }
    | { on_or_after: string }
    | { past_week: EmptyObject }
    | { past_month: EmptyObject }
    | { past_year: EmptyObject }
    | { next_week: EmptyObject }
    | { next_month: EmptyObject }
    | { next_year: EmptyObject }
    | ExistencePropertyFilter;

type PeoplePropertyFilter = { contains: IdRequest } | { does_not_contain: IdRequest } | ExistencePropertyFilter;

type RelationPropertyFilter = { contains: IdRequest } | { does_not_contain: IdRequest } | ExistencePropertyFilter;

type FormulaPropertyFilter =
    | { string: TextPropertyFilter }
    | { checkbox: CheckboxPropertyFilter }
    | { number: NumberPropertyFilter }
    | { date: DatePropertyFilter };

type RollupSubfilterPropertyFilter =
    | { rich_text: TextPropertyFilter }
    | { number: NumberPropertyFilter }
    | { checkbox: CheckboxPropertyFilter }
    | { select: SelectPropertyFilter }
    | { multi_select: MultiSelectPropertyFilter }
    | { relation: RelationPropertyFilter }
    | { date: DatePropertyFilter }
    | { people: PeoplePropertyFilter }
    | { files: ExistencePropertyFilter };

type RollupPropertyFilter =
    | { any: RollupSubfilterPropertyFilter }
    | { none: RollupSubfilterPropertyFilter }
    | { every: RollupSubfilterPropertyFilter }
    | { date: DatePropertyFilter }
    | { number: NumberPropertyFilter };

type PropertyFilter =
    | { title: TextPropertyFilter; property: string; type?: 'title' }
    | { rich_text: TextPropertyFilter; property: string; type?: 'rich_text' }
    | { number: NumberPropertyFilter; property: string; type?: 'number' }
    | { checkbox: CheckboxPropertyFilter; property: string; type?: 'checkbox' }
    | { select: SelectPropertyFilter; property: string; type?: 'select' }
    | {
        multi_select: MultiSelectPropertyFilter;
        property: string;
        type?: 'multi_select';
    }
    | { status: StatusPropertyFilter; property: string; type?: 'status' }
    | { date: DatePropertyFilter; property: string; type?: 'date' }
    | { people: PeoplePropertyFilter; property: string; type?: 'people' }
    | { files: ExistencePropertyFilter; property: string; type?: 'files' }
    | { url: TextPropertyFilter; property: string; type?: 'url' }
    | { email: TextPropertyFilter; property: string; type?: 'email' }
    | {
        phone_number: TextPropertyFilter;
        property: string;
        type?: 'phone_number';
    }
    | { relation: RelationPropertyFilter; property: string; type?: 'relation' }
    | { created_by: PeoplePropertyFilter; property: string; type?: 'created_by' }
    | {
        created_time: DatePropertyFilter;
        property: string;
        type?: 'created_time';
    }
    | {
        last_edited_by: PeoplePropertyFilter;
        property: string;
        type?: 'last_edited_by';
    }
    | {
        last_edited_time: DatePropertyFilter;
        property: string;
        type?: 'last_edited_time';
    }
    | { formula: FormulaPropertyFilter; property: string; type?: 'formula' }
    | { rollup: RollupPropertyFilter; property: string; type?: 'rollup' };

type TimestampCreatedTimeFilter = {
    created_time: DatePropertyFilter;
    timestamp: 'created_time';
    type?: 'created_time';
};

type TimestampLastEditedTimeFilter = {
    last_edited_time: DatePropertyFilter;
    timestamp: 'last_edited_time';
    type?: 'last_edited_time';
};
export type GetSelfParameters = Record<string, never>;

export type GetSelfResponse = UserObjectResponse;

export const getSelf = {
    method: 'get',
    pathParams: [],
    queryParams: [],
    bodyParams: [],
    path: (): string => `users/me`,
} as const;

type GetUserPathParameters = {
    user_id: IdRequest;
};

export type GetUserParameters = GetUserPathParameters;

export type GetUserResponse = UserObjectResponse;

export const getUser = {
    method: 'get',
    pathParams: ['user_id'],
    queryParams: [],
    bodyParams: [],
    path: (p: GetUserPathParameters): string => `users/${p.user_id}`,
} as const;

type ListUsersQueryParameters = {
    start_cursor?: string;
    page_size?: number;
};

export type ListUsersParameters = ListUsersQueryParameters;

export type ListUsersResponse = {
    type: 'user';
    user: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<UserObjectResponse>;
};

export const listUsers = {
    method: 'get',
    pathParams: [],
    queryParams: ['start_cursor', 'page_size'],
    bodyParams: [],
    path: (): string => `users`,
} as const;

type CreatePageBodyParameters =
    | {
        parent: { database_id: IdRequest; type?: 'database_id' };
        properties:
        | Record<
            string,
            | { title: Array<RichTextItemRequest>; type?: 'title' }
            | { rich_text: Array<RichTextItemRequest>; type?: 'rich_text' }
            | { number: number | null; type?: 'number' }
            | { url: TextRequest | null; type?: 'url' }
            | {
                select:
                | {
                    id: StringRequest;
                    name?: StringRequest;
                    color?: SelectColor;
                }
                | null
                | {
                    name: StringRequest;
                    id?: StringRequest;
                    color?: SelectColor;
                }
                | null;
                type?: 'select';
            }
            | {
                multi_select: Array<
                    | {
                        id: StringRequest;
                        name?: StringRequest;
                        color?: SelectColor;
                    }
                    | {
                        name: StringRequest;
                        id?: StringRequest;
                        color?: SelectColor;
                    }
                >;
                type?: 'multi_select';
            }
            | {
                people: Array<
                    | { id: IdRequest }
                    | {
                        person: { email?: string };
                        id: IdRequest;
                        type?: 'person';
                        name?: string | null;
                        avatar_url?: string | null;
                        object?: 'user';
                    }
                    | {
                        bot:
                        | EmptyObject
                        | {
                            owner:
                            | {
                                type: 'user';
                                user:
                                | {
                                    type: 'person';
                                    person: { email: string };
                                    name: string | null;
                                    avatar_url: string | null;
                                    id: IdRequest;
                                    object: 'user';
                                }
                                | PartialUserObjectResponse;
                            }
                            | { type: 'workspace'; workspace: true };
                        };
                        id: IdRequest;
                        type?: 'bot';
                        name?: string | null;
                        avatar_url?: string | null;
                        object?: 'user';
                    }
                >;
                type?: 'people';
            }
            | { email: StringRequest | null; type?: 'email' }
            | { phone_number: StringRequest | null; type?: 'phone_number' }
            | { date: DateRequest | null; type?: 'date' }
            | { checkbox: boolean; type?: 'checkbox' }
            | { relation: Array<{ id: IdRequest }>; type?: 'relation' }
            | {
                files: Array<
                    | {
                        file: { url: string; expiry_time?: string };
                        name: StringRequest;
                        type?: 'file';
                    }
                    | {
                        external: { url: TextRequest };
                        name: StringRequest;
                        type?: 'external';
                    }
                >;
                type?: 'files';
            }
            | {
                status:
                | {
                    id: StringRequest;
                    name?: StringRequest;
                    color?: SelectColor;
                }
                | null
                | {
                    name: StringRequest;
                    id?: StringRequest;
                    color?: SelectColor;
                }
                | null;
                type?: 'status';
            }
        >
        | Record<
            string,
            | Array<RichTextItemRequest>
            | Array<RichTextItemRequest>
            | number
            | null
            | TextRequest
            | null
            | { id: StringRequest; name?: StringRequest; color?: SelectColor }
            | null
            | { name: StringRequest; id?: StringRequest; color?: SelectColor }
            | null
            | Array<
                | {
                    id: StringRequest;
                    name?: StringRequest;
                    color?: SelectColor;
                }
                | {
                    name: StringRequest;
                    id?: StringRequest;
                    color?: SelectColor;
                }
            >
            | Array<
                | { id: IdRequest }
                | {
                    person: { email?: string };
                    id: IdRequest;
                    type?: 'person';
                    name?: string | null;
                    avatar_url?: string | null;
                    object?: 'user';
                }
                | {
                    bot:
                    | EmptyObject
                    | {
                        owner:
                        | {
                            type: 'user';
                            user:
                            | {
                                type: 'person';
                                person: { email: string };
                                name: string | null;
                                avatar_url: string | null;
                                id: IdRequest;
                                object: 'user';
                            }
                            | PartialUserObjectResponse;
                        }
                        | { type: 'workspace'; workspace: true };
                    };
                    id: IdRequest;
                    type?: 'bot';
                    name?: string | null;
                    avatar_url?: string | null;
                    object?: 'user';
                }
            >
            | StringRequest
            | null
            | StringRequest
            | null
            | DateRequest
            | null
            | boolean
            | Array<{ id: IdRequest }>
            | Array<
                | {
                    file: { url: string; expiry_time?: string };
                    name: StringRequest;
                    type?: 'file';
                }
                | {
                    external: { url: TextRequest };
                    name: StringRequest;
                    type?: 'external';
                }
            >
            | { id: StringRequest; name?: StringRequest; color?: SelectColor }
            | null
            | { name: StringRequest; id?: StringRequest; color?: SelectColor }
            | null
        >;
        icon?:
        | { emoji: EmojiRequest; type?: 'emoji' }
        | null
        | { external: { url: TextRequest }; type?: 'external' }
        | null;
        cover?: { external: { url: TextRequest }; type?: 'external' } | null;
        content?: Array<BlockObjectRequest>;
        children?: Array<BlockObjectRequest>;
    }
    | {
        parent: { page_id: IdRequest; type?: 'page_id' };
        properties: {
            title?: { title: Array<RichTextItemRequest>; type?: 'title' } | Array<RichTextItemRequest>;
        };
        icon?:
        | { emoji: EmojiRequest; type?: 'emoji' }
        | null
        | { external: { url: TextRequest }; type?: 'external' }
        | null;
        cover?: { external: { url: TextRequest }; type?: 'external' } | null;
        children?: Array<BlockObjectRequest>;
    };

export type CreatePageParameters = CreatePageBodyParameters;

export type CreatePageResponse = PageObjectResponse | PartialPageObjectResponse;

export const createPage = {
    method: 'post',
    pathParams: [],
    queryParams: [],
    bodyParams: ['parent', 'properties', 'icon', 'cover', 'content', 'children'],
    path: (): string => `pages`,
} as const;

type GetPagePathParameters = {
    page_id: IdRequest;
};

export type GetPageParameters = GetPagePathParameters;

export type GetPageResponse = PageObjectResponse | PartialPageObjectResponse;

export const getPage = {
    method: 'get',
    pathParams: ['page_id'],
    queryParams: [],
    bodyParams: [],
    path: (p: GetPagePathParameters): string => `pages/${p.page_id}`,
} as const;

type UpdatePagePathParameters = {
    page_id: IdRequest;
};

type UpdatePageBodyParameters = {
    properties?:
    | Record<
        string,
        | { title: Array<RichTextItemRequest>; type?: 'title' }
        | { rich_text: Array<RichTextItemRequest>; type?: 'rich_text' }
        | { number: number | null; type?: 'number' }
        | { url: TextRequest | null; type?: 'url' }
        | {
            select:
            | { id: StringRequest; name?: StringRequest; color?: SelectColor }
            | null
            | { name: StringRequest; id?: StringRequest; color?: SelectColor }
            | null;
            type?: 'select';
        }
        | {
            multi_select: Array<
                | { id: StringRequest; name?: StringRequest; color?: SelectColor }
                | { name: StringRequest; id?: StringRequest; color?: SelectColor }
            >;
            type?: 'multi_select';
        }
        | {
            people: Array<
                | { id: IdRequest }
                | {
                    person: { email?: string };
                    id: IdRequest;
                    type?: 'person';
                    name?: string | null;
                    avatar_url?: string | null;
                    object?: 'user';
                }
                | {
                    bot:
                    | EmptyObject
                    | {
                        owner:
                        | {
                            type: 'user';
                            user:
                            | {
                                type: 'person';
                                person: { email: string };
                                name: string | null;
                                avatar_url: string | null;
                                id: IdRequest;
                                object: 'user';
                            }
                            | PartialUserObjectResponse;
                        }
                        | { type: 'workspace'; workspace: true };
                    };
                    id: IdRequest;
                    type?: 'bot';
                    name?: string | null;
                    avatar_url?: string | null;
                    object?: 'user';
                }
            >;
            type?: 'people';
        }
        | { email: StringRequest | null; type?: 'email' }
        | { phone_number: StringRequest | null; type?: 'phone_number' }
        | { date: DateRequest | null; type?: 'date' }
        | { checkbox: boolean; type?: 'checkbox' }
        | { relation: Array<{ id: IdRequest }>; type?: 'relation' }
        | {
            files: Array<
                | {
                    file: { url: string; expiry_time?: string };
                    name: StringRequest;
                    type?: 'file';
                }
                | {
                    external: { url: TextRequest };
                    name: StringRequest;
                    type?: 'external';
                }
            >;
            type?: 'files';
        }
        | {
            status:
            | { id: StringRequest; name?: StringRequest; color?: SelectColor }
            | null
            | { name: StringRequest; id?: StringRequest; color?: SelectColor }
            | null;
            type?: 'status';
        }
    >
    | Record<
        string,
        | Array<RichTextItemRequest>
        | Array<RichTextItemRequest>
        | number
        | null
        | TextRequest
        | null
        | { id: StringRequest; name?: StringRequest; color?: SelectColor }
        | null
        | { name: StringRequest; id?: StringRequest; color?: SelectColor }
        | null
        | Array<
            | { id: StringRequest; name?: StringRequest; color?: SelectColor }
            | { name: StringRequest; id?: StringRequest; color?: SelectColor }
        >
        | Array<
            | { id: IdRequest }
            | {
                person: { email?: string };
                id: IdRequest;
                type?: 'person';
                name?: string | null;
                avatar_url?: string | null;
                object?: 'user';
            }
            | {
                bot:
                | EmptyObject
                | {
                    owner:
                    | {
                        type: 'user';
                        user:
                        | {
                            type: 'person';
                            person: { email: string };
                            name: string | null;
                            avatar_url: string | null;
                            id: IdRequest;
                            object: 'user';
                        }
                        | PartialUserObjectResponse;
                    }
                    | { type: 'workspace'; workspace: true };
                };
                id: IdRequest;
                type?: 'bot';
                name?: string | null;
                avatar_url?: string | null;
                object?: 'user';
            }
        >
        | StringRequest
        | null
        | StringRequest
        | null
        | DateRequest
        | null
        | boolean
        | Array<{ id: IdRequest }>
        | Array<
            | {
                file: { url: string; expiry_time?: string };
                name: StringRequest;
                type?: 'file';
            }
            | {
                external: { url: TextRequest };
                name: StringRequest;
                type?: 'external';
            }
        >
        | { id: StringRequest; name?: StringRequest; color?: SelectColor }
        | null
        | { name: StringRequest; id?: StringRequest; color?: SelectColor }
        | null
    >;
    icon?:
    | { emoji: EmojiRequest; type?: 'emoji' }
    | null
    | { external: { url: TextRequest }; type?: 'external' }
    | null;
    cover?: { external: { url: TextRequest }; type?: 'external' } | null;
    archived?: boolean;
};

export type UpdatePageParameters = UpdatePagePathParameters & UpdatePageBodyParameters;

export type UpdatePageResponse = PageObjectResponse | PartialPageObjectResponse;

export const updatePage = {
    method: 'patch',
    pathParams: ['page_id'],
    queryParams: [],
    bodyParams: ['properties', 'icon', 'cover', 'archived'],
    path: (p: UpdatePagePathParameters): string => `pages/${p.page_id}`,
} as const;

type GetPagePropertyPathParameters = {
    page_id: IdRequest;
    property_id: string;
};

type GetPagePropertyQueryParameters = {
    start_cursor?: string;
    page_size?: number;
};

export type GetPagePropertyParameters = GetPagePropertyPathParameters & GetPagePropertyQueryParameters;

export type GetPagePropertyResponse = PropertyItemObjectResponse | PropertyItemListResponse;

export const getPageProperty = {
    method: 'get',
    pathParams: ['page_id', 'property_id'],
    queryParams: ['start_cursor', 'page_size'],
    bodyParams: [],
    path: (p: GetPagePropertyPathParameters): string => `pages/${p.page_id}/properties/${p.property_id}`,
} as const;

type GetBlockPathParameters = {
    block_id: IdRequest;
};

export type GetBlockParameters = GetBlockPathParameters;

export type GetBlockResponse = PartialBlockObjectResponse | BlockObjectResponse;

export const getBlock = {
    method: 'get',
    pathParams: ['block_id'],
    queryParams: [],
    bodyParams: [],
    path: (p: GetBlockPathParameters): string => `blocks/${p.block_id}`,
} as const;

type UpdateBlockPathParameters = {
    block_id: IdRequest;
};

type UpdateBlockBodyParameters =
    | {
        embed: { url?: string; caption?: Array<RichTextItemRequest> };
        type?: 'embed';
        archived?: boolean;
    }
    | {
        bookmark: { url?: string; caption?: Array<RichTextItemRequest> };
        type?: 'bookmark';
        archived?: boolean;
    }
    | {
        image: {
            caption?: Array<RichTextItemRequest>;
            external?: { url: TextRequest };
        };
        type?: 'image';
        archived?: boolean;
    }
    | {
        video: {
            caption?: Array<RichTextItemRequest>;
            external?: { url: TextRequest };
        };
        type?: 'video';
        archived?: boolean;
    }
    | {
        pdf: {
            caption?: Array<RichTextItemRequest>;
            external?: { url: TextRequest };
        };
        type?: 'pdf';
        archived?: boolean;
    }
    | {
        file: {
            caption?: Array<RichTextItemRequest>;
            external?: { url: TextRequest };
        };
        type?: 'file';
        archived?: boolean;
    }
    | {
        audio: {
            caption?: Array<RichTextItemRequest>;
            external?: { url: TextRequest };
        };
        type?: 'audio';
        archived?: boolean;
    }
    | {
        code: {
            rich_text?: Array<RichTextItemRequest>;
            language?: LanguageRequest;
            caption?: Array<RichTextItemRequest>;
        };
        type?: 'code';
        archived?: boolean;
    }
    | { equation: { expression: string }; type?: 'equation'; archived?: boolean }
    | { divider: EmptyObject; type?: 'divider'; archived?: boolean }
    | { breadcrumb: EmptyObject; type?: 'breadcrumb'; archived?: boolean }
    | {
        table_of_contents: { color?: ApiColor };
        type?: 'table_of_contents';
        archived?: boolean;
    }
    | {
        link_to_page: { page_id: IdRequest; type?: 'page_id' } | { database_id: IdRequest; type?: 'database_id' };
        type?: 'link_to_page';
        archived?: boolean;
    }
    | {
        table_row: { cells: Array<Array<RichTextItemRequest>> };
        type?: 'table_row';
        archived?: boolean;
    }
    | {
        heading_1: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
        };
        type?: 'heading_1';
        archived?: boolean;
    }
    | {
        heading_2: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
        };
        type?: 'heading_2';
        archived?: boolean;
    }
    | {
        heading_3: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
            is_toggleable?: boolean;
        };
        type?: 'heading_3';
        archived?: boolean;
    }
    | {
        paragraph: { rich_text: Array<RichTextItemRequest>; color?: ApiColor };
        type?: 'paragraph';
        archived?: boolean;
    }
    | {
        bulleted_list_item: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
        };
        type?: 'bulleted_list_item';
        archived?: boolean;
    }
    | {
        numbered_list_item: {
            rich_text: Array<RichTextItemRequest>;
            color?: ApiColor;
        };
        type?: 'numbered_list_item';
        archived?: boolean;
    }
    | {
        quote: { rich_text: Array<RichTextItemRequest>; color?: ApiColor };
        type?: 'quote';
        archived?: boolean;
    }
    | {
        to_do: {
            rich_text?: Array<RichTextItemRequest>;
            checked?: boolean;
            color?: ApiColor;
        };
        type?: 'to_do';
        archived?: boolean;
    }
    | {
        toggle: { rich_text: Array<RichTextItemRequest>; color?: ApiColor };
        type?: 'toggle';
        archived?: boolean;
    }
    | {
        template: { rich_text: Array<RichTextItemRequest> };
        type?: 'template';
        archived?: boolean;
    }
    | {
        callout: {
            rich_text?: Array<RichTextItemRequest>;
            icon?: { emoji: EmojiRequest; type?: 'emoji' } | { external: { url: TextRequest }; type?: 'external' };
            color?: ApiColor;
        };
        type?: 'callout';
        archived?: boolean;
    }
    | {
        synced_block: {
            synced_from: { block_id: IdRequest; type?: 'block_id' } | null;
        };
        type?: 'synced_block';
        archived?: boolean;
    }
    | {
        table: { has_column_header?: boolean; has_row_header?: boolean };
        type?: 'table';
        archived?: boolean;
    }
    | { archived?: boolean };

export type UpdateBlockParameters = UpdateBlockPathParameters & UpdateBlockBodyParameters;

export type UpdateBlockResponse = PartialBlockObjectResponse | BlockObjectResponse;

export const updateBlock = {
    method: 'patch',
    pathParams: ['block_id'],
    queryParams: [],
    bodyParams: [
        'embed',
        'type',
        'archived',
        'bookmark',
        'image',
        'video',
        'pdf',
        'file',
        'audio',
        'code',
        'equation',
        'divider',
        'breadcrumb',
        'table_of_contents',
        'link_to_page',
        'table_row',
        'heading_1',
        'heading_2',
        'heading_3',
        'paragraph',
        'bulleted_list_item',
        'numbered_list_item',
        'quote',
        'to_do',
        'toggle',
        'template',
        'callout',
        'synced_block',
        'table',
    ],
    path: (p: UpdateBlockPathParameters): string => `blocks/${p.block_id}`,
} as const;

type DeleteBlockPathParameters = {
    block_id: IdRequest;
};

export type DeleteBlockParameters = DeleteBlockPathParameters;

export type DeleteBlockResponse = PartialBlockObjectResponse | BlockObjectResponse;

export const deleteBlock = {
    method: 'delete',
    pathParams: ['block_id'],
    queryParams: [],
    bodyParams: [],
    path: (p: DeleteBlockPathParameters): string => `blocks/${p.block_id}`,
} as const;

type ListBlockChildrenPathParameters = {
    block_id: IdRequest;
};

type ListBlockChildrenQueryParameters = {
    start_cursor?: string;
    page_size?: number;
};

export type ListBlockChildrenParameters = ListBlockChildrenPathParameters & ListBlockChildrenQueryParameters;

export type ListBlockChildrenResponse = {
    type: 'block';
    block: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<PartialBlockObjectResponse | BlockObjectResponse>;
};

export const listBlockChildren = {
    method: 'get',
    pathParams: ['block_id'],
    queryParams: ['start_cursor', 'page_size'],
    bodyParams: [],
    path: (p: ListBlockChildrenPathParameters): string => `blocks/${p.block_id}/children`,
} as const;

type AppendBlockChildrenPathParameters = {
    block_id: IdRequest;
};

type AppendBlockChildrenBodyParameters = { children: Array<BlockObjectRequest> };

export type AppendBlockChildrenParameters = AppendBlockChildrenPathParameters & AppendBlockChildrenBodyParameters;

export type AppendBlockChildrenResponse = {
    type: 'block';
    block: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<PartialBlockObjectResponse | BlockObjectResponse>;
};

export const appendBlockChildren = {
    method: 'patch',
    pathParams: ['block_id'],
    queryParams: [],
    bodyParams: ['children'],
    path: (p: AppendBlockChildrenPathParameters): string => `blocks/${p.block_id}/children`,
} as const;

type GetDatabasePathParameters = {
    database_id: IdRequest;
};

export type GetDatabaseParameters = GetDatabasePathParameters;

export type GetDatabaseResponse = PartialDatabaseObjectResponse | DatabaseObjectResponse;

export const getDatabase = {
    method: 'get',
    pathParams: ['database_id'],
    queryParams: [],
    bodyParams: [],
    path: (p: GetDatabasePathParameters): string => `databases/${p.database_id}`,
} as const;

type UpdateDatabasePathParameters = {
    database_id: IdRequest;
};

type UpdateDatabaseBodyParameters = {
    title?: Array<RichTextItemRequest>;
    description?: Array<RichTextItemRequest>;
    icon?:
    | { emoji: EmojiRequest; type?: 'emoji' }
    | null
    | { external: { url: TextRequest }; type?: 'external' }
    | null;
    cover?: { external: { url: TextRequest }; type?: 'external' } | null;
    properties?: Record<
        string,
        | { number: { format?: NumberFormat }; type?: 'number'; name?: string }
        | null
        | { formula: { expression?: string }; type?: 'formula'; name?: string }
        | null
        | {
            select: {
                options?: Array<
                    | { id: StringRequest; name?: StringRequest; color?: SelectColor }
                    | { name: StringRequest; id?: StringRequest; color?: SelectColor }
                >;
            };
            type?: 'select';
            name?: string;
        }
        | null
        | {
            multi_select: {
                options?: Array<
                    | { id: StringRequest; name?: StringRequest; color?: SelectColor }
                    | { name: StringRequest; id?: StringRequest; color?: SelectColor }
                >;
            };
            type?: 'multi_select';
            name?: string;
        }
        | null
        | { status: EmptyObject; type?: 'status'; name?: string }
        | null
        | {
            relation:
            | {
                single_property: EmptyObject;
                database_id: IdRequest;
                type?: 'single_property';
            }
            | {
                dual_property: Record<string, never>;
                database_id: IdRequest;
                type?: 'dual_property';
            };
            type?: 'relation';
            name?: string;
        }
        | null
        | {
            rollup:
            | {
                rollup_property_name: string;
                relation_property_name: string;
                function: RollupFunction;
                rollup_property_id?: string;
                relation_property_id?: string;
            }
            | {
                rollup_property_name: string;
                relation_property_id: string;
                function: RollupFunction;
                relation_property_name?: string;
                rollup_property_id?: string;
            }
            | {
                relation_property_name: string;
                rollup_property_id: string;
                function: RollupFunction;
                rollup_property_name?: string;
                relation_property_id?: string;
            }
            | {
                rollup_property_id: string;
                relation_property_id: string;
                function: RollupFunction;
                rollup_property_name?: string;
                relation_property_name?: string;
            };
            type?: 'rollup';
            name?: string;
        }
        | null
        | { title: EmptyObject; type?: 'title'; name?: string }
        | null
        | { rich_text: EmptyObject; type?: 'rich_text'; name?: string }
        | null
        | { url: EmptyObject; type?: 'url'; name?: string }
        | null
        | { people: EmptyObject; type?: 'people'; name?: string }
        | null
        | { files: EmptyObject; type?: 'files'; name?: string }
        | null
        | { email: EmptyObject; type?: 'email'; name?: string }
        | null
        | { phone_number: EmptyObject; type?: 'phone_number'; name?: string }
        | null
        | { date: EmptyObject; type?: 'date'; name?: string }
        | null
        | { checkbox: EmptyObject; type?: 'checkbox'; name?: string }
        | null
        | { created_by: EmptyObject; type?: 'created_by'; name?: string }
        | null
        | { created_time: EmptyObject; type?: 'created_time'; name?: string }
        | null
        | { last_edited_by: EmptyObject; type?: 'last_edited_by'; name?: string }
        | null
        | {
            last_edited_time: EmptyObject;
            type?: 'last_edited_time';
            name?: string;
        }
        | null
        | { name: string }
        | null
    >;
    is_inline?: boolean;
    archived?: boolean;
};

export type UpdateDatabaseParameters = UpdateDatabasePathParameters & UpdateDatabaseBodyParameters;

export type UpdateDatabaseResponse = PartialDatabaseObjectResponse | DatabaseObjectResponse;

export const updateDatabase = {
    method: 'patch',
    pathParams: ['database_id'],
    queryParams: [],
    bodyParams: ['title', 'description', 'icon', 'cover', 'properties', 'is_inline', 'archived'],
    path: (p: UpdateDatabasePathParameters): string => `databases/${p.database_id}`,
} as const;

type QueryDatabasePathParameters = {
    database_id: IdRequest;
};

type QueryDatabaseBodyParameters = {
    sorts?: Array<
        | { property: string; direction: 'ascending' | 'descending' }
        | {
            timestamp: 'created_time' | 'last_edited_time';
            direction: 'ascending' | 'descending';
        }
    >;
    filter?:
    | {
        or: Array<
            | PropertyFilter
            | TimestampCreatedTimeFilter
            | TimestampLastEditedTimeFilter
            | { or: Array<PropertyFilter> }
            | { and: Array<PropertyFilter> }
        >;
    }
    | {
        and: Array<
            | PropertyFilter
            | TimestampCreatedTimeFilter
            | TimestampLastEditedTimeFilter
            | { or: Array<PropertyFilter> }
            | { and: Array<PropertyFilter> }
        >;
    }
    | PropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter;
    start_cursor?: string;
    page_size?: number;
    archived?: boolean;
};

export type QueryDatabaseParameters = QueryDatabasePathParameters & QueryDatabaseBodyParameters;

export type QueryDatabaseResponse = {
    type: 'page';
    page: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<PageObjectResponse | PartialPageObjectResponse>;
};

export const queryDatabase = {
    method: 'post',
    pathParams: ['database_id'],
    queryParams: [],
    bodyParams: ['sorts', 'filter', 'start_cursor', 'page_size', 'archived'],
    path: (p: QueryDatabasePathParameters): string => `databases/${p.database_id}/query`,
} as const;

type ListDatabasesQueryParameters = {
    start_cursor?: string;
    page_size?: number;
};

export type ListDatabasesParameters = ListDatabasesQueryParameters;

export type ListDatabasesResponse = {
    type: 'database';
    database: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<PartialDatabaseObjectResponse | DatabaseObjectResponse>;
};

export const listDatabases = {
    method: 'get',
    pathParams: [],
    queryParams: ['start_cursor', 'page_size'],
    bodyParams: [],
    path: (): string => `databases`,
} as const;

type CreateDatabaseBodyParameters = {
    parent: { page_id: IdRequest; type?: 'page_id' };
    properties: Record<
        string,
        | { number: { format?: NumberFormat }; type?: 'number' }
        | { formula: { expression?: string }; type?: 'formula' }
        | {
            select: {
                options?: Array<{ name: StringRequest; color?: SelectColor }>;
            };
            type?: 'select';
        }
        | {
            multi_select: {
                options?: Array<{ name: StringRequest; color?: SelectColor }>;
            };
            type?: 'multi_select';
        }
        | { status: EmptyObject; type?: 'status' }
        | {
            relation:
            | {
                single_property: EmptyObject;
                database_id: IdRequest;
                type?: 'single_property';
            }
            | {
                dual_property: Record<string, never>;
                database_id: IdRequest;
                type?: 'dual_property';
            };
            type?: 'relation';
        }
        | {
            rollup:
            | {
                rollup_property_name: string;
                relation_property_name: string;
                function: RollupFunction;
                rollup_property_id?: string;
                relation_property_id?: string;
            }
            | {
                rollup_property_name: string;
                relation_property_id: string;
                function: RollupFunction;
                relation_property_name?: string;
                rollup_property_id?: string;
            }
            | {
                relation_property_name: string;
                rollup_property_id: string;
                function: RollupFunction;
                rollup_property_name?: string;
                relation_property_id?: string;
            }
            | {
                rollup_property_id: string;
                relation_property_id: string;
                function: RollupFunction;
                rollup_property_name?: string;
                relation_property_name?: string;
            };
            type?: 'rollup';
        }
        | { title: EmptyObject; type?: 'title' }
        | { rich_text: EmptyObject; type?: 'rich_text' }
        | { url: EmptyObject; type?: 'url' }
        | { people: EmptyObject; type?: 'people' }
        | { files: EmptyObject; type?: 'files' }
        | { email: EmptyObject; type?: 'email' }
        | { phone_number: EmptyObject; type?: 'phone_number' }
        | { date: EmptyObject; type?: 'date' }
        | { checkbox: EmptyObject; type?: 'checkbox' }
        | { created_by: EmptyObject; type?: 'created_by' }
        | { created_time: EmptyObject; type?: 'created_time' }
        | { last_edited_by: EmptyObject; type?: 'last_edited_by' }
        | { last_edited_time: EmptyObject; type?: 'last_edited_time' }
    >;
    icon?:
    | { emoji: EmojiRequest; type?: 'emoji' }
    | null
    | { external: { url: TextRequest }; type?: 'external' }
    | null;
    cover?: { external: { url: TextRequest }; type?: 'external' } | null;
    title?: Array<RichTextItemRequest>;
    description?: Array<RichTextItemRequest>;
    is_inline?: boolean;
};

export type CreateDatabaseParameters = CreateDatabaseBodyParameters;

export type CreateDatabaseResponse = PartialDatabaseObjectResponse | DatabaseObjectResponse;

export const createDatabase = {
    method: 'post',
    pathParams: [],
    queryParams: [],
    bodyParams: ['parent', 'properties', 'icon', 'cover', 'title', 'description', 'is_inline'],
    path: (): string => `databases`,
} as const;

type SearchBodyParameters = {
    sort?: {
        timestamp: 'last_edited_time';
        direction: 'ascending' | 'descending';
    };
    query?: string;
    start_cursor?: string;
    page_size?: number;
    filter?: { property: 'object'; value: 'page' | 'database' };
};

export type SearchParameters = SearchBodyParameters;

export type SearchResponse = {
    type: 'page_or_database';
    page_or_database: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<
        PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse
    >;
};

export const search = {
    method: 'post',
    pathParams: [],
    queryParams: [],
    bodyParams: ['sort', 'query', 'start_cursor', 'page_size', 'filter'],
    path: (): string => `search`,
} as const;

type CreateCommentBodyParameters =
    | {
        parent: { page_id: IdRequest; type?: 'page_id' };
        rich_text: Array<RichTextItemRequest>;
    }
    | { discussion_id: IdRequest; rich_text: Array<RichTextItemRequest> };

export type CreateCommentParameters = CreateCommentBodyParameters;

export type CreateCommentResponse = CommentObjectResponse | PartialCommentObjectResponse;

export const createComment = {
    method: 'post',
    pathParams: [],
    queryParams: [],
    bodyParams: ['parent', 'rich_text', 'discussion_id'],
    path: (): string => `comments`,
} as const;

type ListCommentsQueryParameters = {
    block_id: IdRequest;
    start_cursor?: string;
    page_size?: number;
};

export type ListCommentsParameters = ListCommentsQueryParameters;

export type ListCommentsResponse = {
    type: 'comment';
    comment: EmptyObject;
    object: 'list';
    next_cursor: string | null;
    has_more: boolean;
    results: Array<CommentObjectResponse>;
};

export const listComments = {
    method: 'get',
    pathParams: [],
    queryParams: ['block_id', 'start_cursor', 'page_size'],
    bodyParams: [],
    path: (): string => `comments`,
} as const;
