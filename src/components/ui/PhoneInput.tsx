
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface PhoneInputProps {
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

const countryCodes = [
	{ code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
	{ code: '+355', country: 'Albania', flag: '🇦🇱' },
	{ code: '+213', country: 'Algeria', flag: '🇩🇿' },
	{ code: '+1684', country: 'American Samoa', flag: '🇦🇸' },
	{ code: '+376', country: 'Andorra', flag: '🇦🇩' },
	{ code: '+244', country: 'Angola', flag: '🇦🇴' },
	{ code: '+1264', country: 'Anguilla', flag: '🇦🇮' },
	{ code: '+672', country: 'Antarctica', flag: '🇦🇶' },
	{ code: '+1268', country: 'Antigua and Barbuda', flag: '🇦🇬' },
	{ code: '+54', country: 'Argentina', flag: '🇦🇷' },
	{ code: '+374', country: 'Armenia', flag: '🇦🇲' },
	{ code: '+297', country: 'Aruba', flag: '🇦🇼' },
	{ code: '+61', country: 'Australia', flag: '🇦🇺' },
	{ code: '+43', country: 'Austria', flag: '🇦🇹' },
	{ code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
	{ code: '+1242', country: 'Bahamas', flag: '🇧🇸' },
	{ code: '+973', country: 'Bahrain', flag: '🇧🇭' },
	{ code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
	{ code: '+1246', country: 'Barbados', flag: '🇧🇧' },
	{ code: '+375', country: 'Belarus', flag: '🇧🇾' },
	{ code: '+32', country: 'Belgium', flag: '🇧🇪' },
	{ code: '+501', country: 'Belize', flag: '🇧🇿' },
	{ code: '+229', country: 'Benin', flag: '🇧🇯' },
	{ code: '+1441', country: 'Bermuda', flag: '🇧🇲' },
	{ code: '+975', country: 'Bhutan', flag: '🇧🇹' },
	{ code: '+591', country: 'Bolivia', flag: '🇧🇴' },
	{ code: '+387', country: 'Bosnia and Herzegovina', flag: '🇧🇦' },
	{ code: '+267', country: 'Botswana', flag: '🇧🇼' },
	{ code: '+55', country: 'Brazil', flag: '🇧🇷' },
	{ code: '+246', country: 'British Indian Ocean Territory', flag: '🇮🇴' },
	{ code: '+673', country: 'Brunei', flag: '🇧🇳' },
	{ code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
	{ code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
	{ code: '+257', country: 'Burundi', flag: '🇧🇮' },
	{ code: '+855', country: 'Cambodia', flag: '🇰🇭' },
	{ code: '+237', country: 'Cameroon', flag: '🇨🇲' },
	{ code: '+1', country: 'Canada', flag: '🇨🇦' },
	{ code: '+238', country: 'Cape Verde', flag: '🇨🇻' },
	{ code: '+345', country: 'Cayman Islands', flag: '🇰🇾' },
	{ code: '+236', country: 'Central African Republic', flag: '🇨🇫' },
	{ code: '+235', country: 'Chad', flag: '🇹🇩' },
	{ code: '+56', country: 'Chile', flag: '🇨🇱' },
	{ code: '+86', country: 'China', flag: '🇨🇳' },
	{ code: '+6189164', country: 'Christmas Island', flag: '🇨🇽' },
	{ code: '+6189162', country: 'Cocos (Keeling) Islands', flag: '🇨🇨' },
	{ code: '+57', country: 'Colombia', flag: '🇨🇴' },
	{ code: '+269', country: 'Comoros', flag: '🇰🇲' },
	{ code: '+242', country: 'Congo Republic', flag: '🇨🇬' },
	{ code: '+243', country: 'Congo, Democratic Republic', flag: '🇨🇩' },
	{ code: '+682', country: 'Cook Islands', flag: '🇨🇰' },
	{ code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
	{ code: '+385', country: 'Croatia', flag: '🇭🇷' },
	{ code: '+53', country: 'Cuba', flag: '🇨🇺' },
	{ code: '+357', country: 'Cyprus', flag: '🇨🇾' },
	{ code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
	{ code: '+45', country: 'Denmark', flag: '🇩🇰' },
	{ code: '+253', country: 'Djibouti', flag: '🇩🇯' },
	{ code: '+1767', country: 'Dominica', flag: '🇩🇲' },
	{ code: '+1809', country: 'Dominican Republic', flag: '🇩🇴' },
	{ code: '+593', country: 'Ecuador', flag: '🇪🇨' },
	{ code: '+20', country: 'Egypt', flag: '🇪🇬' },
	{ code: '+503', country: 'El Salvador', flag: '🇸🇻' },
	{ code: '+240', country: 'Equatorial Guinea', flag: '🇬🇶' },
	{ code: '+291', country: 'Eritrea', flag: '🇪🇷' },
	{ code: '+372', country: 'Estonia', flag: '🇪🇪' },
	{ code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
	{ code: '+500', country: 'Falkland Islands', flag: '🇫🇰' },
	{ code: '+298', country: 'Faroe Islands', flag: '🇫🇴' },
	{ code: '+679', country: 'Fiji', flag: '🇫🇯' },
	{ code: '+358', country: 'Finland', flag: '🇫🇮' },
	{ code: '+33', country: 'France', flag: '🇫🇷' },
	{ code: '+594', country: 'French Guiana', flag: '🇬🇫' },
	{ code: '+689', country: 'French Polynesia', flag: '🇵🇫' },
	{ code: '+241', country: 'Gabon', flag: '🇬🇦' },
	{ code: '+220', country: 'Gambia', flag: '🇬🇲' },
	{ code: '+995', country: 'Georgia', flag: '🇬🇪' },
	{ code: '+49', country: 'Germany', flag: '🇩🇪' },
	{ code: '+233', country: 'Ghana', flag: '🇬🇭' },
	{ code: '+350', country: 'Gibraltar', flag: '🇬🇮' },
	{ code: '+30', country: 'Greece', flag: '🇬🇷' },
	{ code: '+299', country: 'Greenland', flag: '🇬🇱' },
	{ code: '+1473', country: 'Grenada', flag: '🇬🇩' },
	{ code: '+590', country: 'Guadeloupe', flag: '🇬🇵' },
	{ code: '+1671', country: 'Guam', flag: '🇬🇺' },
	{ code: '+502', country: 'Guatemala', flag: '🇬🇹' },
	{ code: '+441481', country: 'Guernsey', flag: '🇬🇬' },
	{ code: '+224', country: 'Guinea', flag: '🇬🇳' },
	{ code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
	{ code: '+592', country: 'Guyana', flag: '🇬🇾' },
	{ code: '+509', country: 'Haiti', flag: '🇭🇹' },
	{ code: '+504', country: 'Honduras', flag: '🇭🇳' },
	{ code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
	{ code: '+36', country: 'Hungary', flag: '🇭🇺' },
	{ code: '+354', country: 'Iceland', flag: '🇮🇸' },
	{ code: '+91', country: 'India', flag: '🇮🇳' },
	{ code: '+62', country: 'Indonesia', flag: '🇮🇩' },
	{ code: '+98', country: 'Iran', flag: '🇮🇷' },
	{ code: '+964', country: 'Iraq', flag: '🇮🇶' },
	{ code: '+353', country: 'Ireland', flag: '🇮🇪' },
	{ code: '+441624', country: 'Isle of Man', flag: '🇮🇲' },
	{ code: '+972', country: 'Israel', flag: '🇮🇱' },
	{ code: '+39', country: 'Italy', flag: '🇮🇹' },
	{ code: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
	{ code: '+1876', country: 'Jamaica', flag: '🇯🇲' },
	{ code: '+81', country: 'Japan', flag: '🇯🇵' },
	{ code: '+441534', country: 'Jersey', flag: '🇯🇪' },
	{ code: '+962', country: 'Jordan', flag: '🇯🇴' },
	{ code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
	{ code: '+254', country: 'Kenya', flag: '🇰🇪' },
	{ code: '+686', country: 'Kiribati', flag: '🇰🇮' },
	{ code: '+383', country: 'Kosovo', flag: '🇽🇰' },
	{ code: '+965', country: 'Kuwait', flag: '🇰🇼' },
	{ code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
	{ code: '+856', country: 'Laos', flag: '🇱🇦' },
	{ code: '+371', country: 'Latvia', flag: '🇱🇻' },
	{ code: '+961', country: 'Lebanon', flag: '🇱🇧' },
	{ code: '+266', country: 'Lesotho', flag: '🇱🇸' },
	{ code: '+231', country: 'Liberia', flag: '🇱🇷' },
	{ code: '+218', country: 'Libya', flag: '🇱🇾' },
	{ code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
	{ code: '+370', country: 'Lithuania', flag: '🇱🇹' },
	{ code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
	{ code: '+853', country: 'Macao', flag: '🇲🇴' },
	{ code: '+389', country: 'North Macedonia', flag: '🇲🇰' },
	{ code: '+261', country: 'Madagascar', flag: '🇲🇬' },
	{ code: '+265', country: 'Malawi', flag: '🇲🇼' },
	{ code: '+60', country: 'Malaysia', flag: '🇲🇾' },
	{ code: '+960', country: 'Maldives', flag: '🇲🇻' },
	{ code: '+223', country: 'Mali', flag: '🇲🇱' },
	{ code: '+356', country: 'Malta', flag: '🇲🇹' },
	{ code: '+692', country: 'Marshall Islands', flag: '🇲🇭' },
	{ code: '+596', country: 'Martinique', flag: '🇲🇶' },
	{ code: '+222', country: 'Mauritania', flag: '🇲🇷' },
	{ code: '+230', country: 'Mauritius', flag: '🇲🇺' },
	{ code: '+262639', country: 'Mayotte', flag: '🇾🇹' },
	{ code: '+52', country: 'Mexico', flag: '🇲🇽' },
	{ code: '+691', country: 'Micronesia', flag: '🇫🇲' },
	{ code: '+373', country: 'Moldova', flag: '🇲🇩' },
	{ code: '+377', country: 'Monaco', flag: '🇲🇨' },
	{ code: '+976', country: 'Mongolia', flag: '🇲🇳' },
	{ code: '+382', country: 'Montenegro', flag: '🇲🇪' },
	{ code: '+1664', country: 'Montserrat', flag: '🇲🇸' },
	{ code: '+212', country: 'Morocco', flag: '🇲🇦' },
	{ code: '+258', country: 'Mozambique', flag: '🇲🇿' },
	{ code: '+95', country: 'Myanmar', flag: '🇲🇲' },
	{ code: '+264', country: 'Namibia', flag: '🇳🇦' },
	{ code: '+674', country: 'Nauru', flag: '🇳🇷' },
	{ code: '+977', country: 'Nepal', flag: '🇳🇵' },
	{ code: '+31', country: 'Netherlands', flag: '🇳🇱' },
	{ code: '+687', country: 'New Caledonia', flag: '🇳🇨' },
	{ code: '+64', country: 'New Zealand', flag: '🇳🇿' },
	{ code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
	{ code: '+227', country: 'Niger', flag: '🇳🇪' },
	{ code: '+234', country: 'Nigeria', flag: '🇳🇬' },
	{ code: '+683', country: 'Niue', flag: '🇳🇺' },
	{ code: '+672', country: 'Norfolk Island', flag: '🇳🇫' },
	{ code: '+850', country: 'North Korea', flag: '🇰🇵' },
	{ code: '+1670', country: 'Northern Mariana Islands', flag: '🇲🇵' },
	{ code: '+47', country: 'Norway', flag: '🇳🇴' },
	{ code: '+968', country: 'Oman', flag: '🇴🇲' },
	{ code: '+92', country: 'Pakistan', flag: '🇵🇰' },
	{ code: '+680', country: 'Palau', flag: '🇵🇼' },
	{ code: '+970', country: 'Palestine', flag: '🇵🇸' },
	{ code: '+507', country: 'Panama', flag: '🇵🇦' },
	{ code: '+675', country: 'Papua New Guinea', flag: '🇵🇬' },
	{ code: '+595', country: 'Paraguay', flag: '🇵🇾' },
	{ code: '+51', country: 'Peru', flag: '🇵🇪' },
	{ code: '+63', country: 'Philippines', flag: '🇵🇭' },
	{ code: '+64', country: 'Pitcairn Islands', flag: '🇵🇳' },
	{ code: '+48', country: 'Poland', flag: '🇵🇱' },
	{ code: '+351', country: 'Portugal', flag: '🇵🇹' },
	{ code: '+1787', country: 'Puerto Rico', flag: '🇵🇷' },
	{ code: '+974', country: 'Qatar', flag: '🇶🇦' },
	{ code: '+262692', country: 'Reunion', flag: '🇷🇪' },
	{ code: '+40', country: 'Romania', flag: '🇷🇴' },
	{ code: '+7', country: 'Russia', flag: '🇷🇺' },
	{ code: '+250', country: 'Rwanda', flag: '🇷🇼' },
	{ code: '+590', country: 'Saint Barthelemy', flag: '🇧🇱' },
	{ code: '+290', country: 'Saint Helena', flag: '🇸🇭' },
	{ code: '+1869', country: 'Saint Kitts and Nevis', flag: '🇰🇳' },
	{ code: '+1758', country: 'Saint Lucia', flag: '🇱🇨' },
	{ code: '+590', country: 'Saint Martin', flag: '🇲🇫' },
	{ code: '+508', country: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
	{ code: '+1784', country: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
	{ code: '+685', country: 'Samoa', flag: '🇼🇸' },
	{ code: '+378', country: 'San Marino', flag: '🇸🇲' },
	{ code: '+239', country: 'Sao Tome and Principe', flag: '🇸🇹' },
	{ code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
	{ code: '+221', country: 'Senegal', flag: '🇸🇳' },
	{ code: '+381', country: 'Serbia', flag: '🇷🇸' },
	{ code: '+248', country: 'Seychelles', flag: '🇸🇨' },
	{ code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
	{ code: '+65', country: 'Singapore', flag: '🇸🇬' },
	{ code: '+421', country: 'Slovakia', flag: '🇸🇰' },
	{ code: '+386', country: 'Slovenia', flag: '🇸🇮' },
	{ code: '+677', country: 'Solomon Islands', flag: '🇸🇧' },
	{ code: '+252', country: 'Somalia', flag: '🇸🇴' },
	{ code: '+27', country: 'South Africa', flag: '🇿🇦' },
	{ code: '+82', country: 'South Korea', flag: '🇰🇷' },
	{ code: '+211', country: 'South Sudan', flag: '🇸🇸' },
	{ code: '+34', country: 'Spain', flag: '🇪🇸' },
	{ code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
	{ code: '+249', country: 'Sudan', flag: '🇸🇩' },
	{ code: '+597', country: 'Suriname', flag: '🇸🇷' },
	{ code: '+4779', country: 'Svalbard and Jan Mayen', flag: '🇸🇯' },
	{ code: '+268', country: 'Swaziland', flag: '🇸🇿' },
	{ code: '+46', country: 'Sweden', flag: '🇸🇪' },
	{ code: '+41', country: 'Switzerland', flag: '🇨🇭' },
	{ code: '+963', country: 'Syria', flag: '🇸🇾' },
	{ code: '+886', country: 'Taiwan', flag: '🇹🇼' },
	{ code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
	{ code: '+255', country: 'Tanzania', flag: '🇹🇿' },
	{ code: '+66', country: 'Thailand', flag: '🇹🇭' },
	{ code: '+670', country: 'Timor-Leste', flag: '🇹🇱' },
	{ code: '+228', country: 'Togo', flag: '🇹🇬' },
	{ code: '+690', country: 'Tokelau', flag: '🇹🇰' },
	{ code: '+676', country: 'Tonga', flag: '🇹🇴' },
	{ code: '+1868', country: 'Trinidad and Tobago', flag: '🇹🇹' },
	{ code: '+216', country: 'Tunisia', flag: '🇹🇳' },
	{ code: '+90', country: 'Turkey', flag: '🇹🇷' },
	{ code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
	{ code: '+1649', country: 'Turks and Caicos Islands', flag: '🇹🇨' },
	{ code: '+688', country: 'Tuvalu', flag: '🇹🇻' },
	{ code: '+256', country: 'Uganda', flag: '🇺🇬' },
	{ code: '+380', country: 'Ukraine', flag: '🇺🇦' },
	{ code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
	{ code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
	{ code: '+1', country: 'United States', flag: '🇺🇸' },
	{ code: '+598', country: 'Uruguay', flag: '🇺🇾' },
	{ code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
	{ code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
	{ code: '+379', country: 'Vatican City State', flag: '🇻🇦' },
	{ code: '+58', country: 'Venezuela', flag: '🇻🇪' },
	{ code: '+84', country: 'Vietnam', flag: '🇻🇳' },
	{ code: '+1284', country: 'Virgin Islands, British', flag: '🇻🇬' },
	{ code: '+1340', country: 'Virgin Islands, U.S.', flag: '🇻🇮' },
	{ code: '+681', country: 'Wallis and Futuna', flag: '🇼🇫' },
	{ code: '+967', country: 'Yemen', flag: '🇾🇪' },
	{ code: '+260', country: 'Zambia', flag: '🇿🇲' },
	{ code: '+263', country: 'Zimbabwe', flag: '🇿🇼' }
].sort((a, b) => a.country.localeCompare(b.country));

export const PhoneInput: React.FC<PhoneInputProps> = ({
	label,
	placeholder,
	value,
	onChange,
	className = ""
}) => {
	const [selectedCountryCode, setSelectedCountryCode] = useState('+66');
	const [searchTerm, setSearchTerm] = useState('');

	// Extract phone number without country code from current value
	const getPhoneNumber = (fullValue: string) => {
		if (!fullValue) return '';

		// Find if the value starts with any country code
		const matchingCode = countryCodes.find(cc => fullValue.startsWith(cc.code));
		if (matchingCode) {
			return fullValue.substring(matchingCode.code.length).trim();
		}

		return fullValue;
	};

	// Extract country code from current value
	const getCountryCode = (fullValue: string) => {
		if (!fullValue) return '+66';

		const matchingCode = countryCodes.find(cc => fullValue.startsWith(cc.code));
		return matchingCode ? matchingCode.code : '+66';
	};

	const phoneNumber = getPhoneNumber(value);
	const currentCountryCode = getCountryCode(value);

	// Filter countries based on search term
	const filteredCountries = useMemo(() => {
		if (!searchTerm) return countryCodes;

		const lowerSearchTerm = searchTerm.toLowerCase();
		return countryCodes.filter(country =>
			country.country.toLowerCase().includes(lowerSearchTerm) ||
			country.code.includes(searchTerm)
		);
	}, [searchTerm]);

	// Update selected country code if it differs from current
	React.useEffect(() => {
		if (currentCountryCode !== selectedCountryCode) {
			setSelectedCountryCode(currentCountryCode);
		}
	}, [currentCountryCode]);

	const handleCountryCodeChange = (newCode: string) => {
		setSelectedCountryCode(newCode);
		const newValue = phoneNumber ? `${newCode} ${phoneNumber}` : newCode;
		onChange(newValue);
	};

	const handlePhoneNumberChange = (newPhoneNumber: string) => {
		const newValue = newPhoneNumber ? `${selectedCountryCode} ${newPhoneNumber}` : selectedCountryCode;
		onChange(newValue);
	};

	return (
		<div className={`box-border flex flex-col m-0 p-0 ${className}`}>
			<label className="box-border text-text-primary text-[14px] font-medium mb-2 m-0 p-0">
				{label}
			</label>
			<div className="flex gap-2">
				<Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
					<SelectTrigger className="w-24 h-[40px] border bg-input-bg text-text-primary border-input-border focus:outline-none focus:border-blue-500">
						<SelectValue>
							{(() => {
								const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode);
								return selectedCountry ? (
									<span className="flex items-center gap-1">
										<span>{selectedCountry.flag}</span>
										<span>{selectedCountry.code}</span>
									</span>
								) : selectedCountryCode;
							})()}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className="bg-input-bg border-input-border max-h-[300px]">
						<div className="sticky top-0 p-2 bg-input-bg border-b border-input-border">
							<input
								type="text"
								placeholder="Search country or code..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full h-8 px-2 text-sm bg-input-bg text-text-primary placeholder:text-text-secondary border border-input-border rounded focus:outline-none focus:border-blue-500"
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
						<div className="max-h-[200px] overflow-y-auto">
							{filteredCountries.length === 0 ? (
								<div className="p-2 text-text-secondary text-sm">No countries found</div>
							) : (
								filteredCountries.map((country) => (
									<SelectItem
										key={`${country.code}-${country.country}`}
										value={country.code}
										className="text-text-primary hover:bg-[rgba(255,255,255,0.1)]"
									>
										<span className="flex items-center gap-2">
											<span>{country.flag}</span>
											<span className="font-medium">{country.code}</span>
											<span className="text-text-secondary text-sm">{country.country}</span>
										</span>
									</SelectItem>
								))
							)}
						</div>
					</SelectContent>
				</Select>
				<input
					type="tel"
					value={phoneNumber}
					onChange={(e) => handlePhoneNumberChange(e.target.value)}
					placeholder={placeholder}
					className="flex-1 box-border h-[40px] w-full border bg-input-bg text-text-primary placeholder:text-text-secondary text-[14px] font-normal m-0 px-3 py-0 rounded-md border-solid border-input-border focus:outline-none focus:border-blue-500"
				/>
			</div>
		</div>
	);
};
