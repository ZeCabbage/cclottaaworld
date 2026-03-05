/* ============================================
   Character Configuration
   All customization options defined as data.
   Adding a new option = adding an entry here.
   ============================================ */

export const characterConfig = {
    skinTones: [
        { id: 'fair', name: 'Fair', color: '#FFDFC4' },
        { id: 'light', name: 'Light', color: '#F0C8A0' },
        { id: 'medium', name: 'Medium', color: '#D4A574' },
        { id: 'olive', name: 'Olive', color: '#C49060' },
        { id: 'tan', name: 'Tan', color: '#A0724A' },
        { id: 'brown', name: 'Brown', color: '#8D5524' },
        { id: 'dark', name: 'Dark', color: '#6B3A1F' },
        { id: 'deep', name: 'Deep', color: '#4A2511' },
    ],

    hairStyles: [
        { id: 'short', name: 'Short' },
        { id: 'long', name: 'Long' },
        { id: 'curly', name: 'Curly' },
        { id: 'braids', name: 'Braids' },
        { id: 'bun', name: 'Bun' },
        { id: 'ponytail', name: 'Ponytail' },
        { id: 'afro', name: 'Afro' },
        { id: 'pixie', name: 'Pixie' },
    ],

    hairColors: [
        { id: 'black', name: 'Black', color: '#1A1A1A' },
        { id: 'brown', name: 'Brown', color: '#5C3317' },
        { id: 'blonde', name: 'Blonde', color: '#F5DEB3' },
        { id: 'red', name: 'Red', color: '#B22222' },
        { id: 'pink', name: 'Pink', color: '#FF69B4' },
        { id: 'blue', name: 'Blue', color: '#4169E1' },
        { id: 'purple', name: 'Purple', color: '#8A2BE2' },
        { id: 'green', name: 'Green', color: '#2E8B57' },
        { id: 'silver', name: 'Silver', color: '#C0C0C0' },
        { id: 'white', name: 'White', color: '#F0F0F0' },
    ],

    eyeTypes: [
        { id: 'round', name: 'Round' },
        { id: 'almond', name: 'Almond' },
        { id: 'catEye', name: 'Cat Eye' },
        { id: 'doe', name: 'Doe' },
        { id: 'sharp', name: 'Sharp' },
        { id: 'sparkle', name: 'Sparkle' },
        { id: 'sleepy', name: 'Sleepy' },
        { id: 'fierce', name: 'Fierce' },
    ],

    eyeColors: [
        { id: 'brown', name: 'Brown', color: '#8B4513' },
        { id: 'hazel', name: 'Hazel', color: '#8E7618' },
        { id: 'green', name: 'Green', color: '#228B22' },
        { id: 'blue', name: 'Blue', color: '#4169E1' },
        { id: 'grey', name: 'Grey', color: '#708090' },
        { id: 'violet', name: 'Violet', color: '#9370DB' },
        { id: 'amber', name: 'Amber', color: '#FFBF00' },
        { id: 'red', name: 'Red', color: '#DC143C' },
    ],

    expressions: [
        { id: 'neutral', name: 'Neutral', emoji: '😐' },
        { id: 'smile', name: 'Smile', emoji: '😊' },
        { id: 'smirk', name: 'Smirk', emoji: '😏' },
        { id: 'pout', name: 'Pout', emoji: '😤' },
        { id: 'excited', name: 'Excited', emoji: '😆' },
        { id: 'serious', name: 'Serious', emoji: '😠' },
    ],

    tops: [
        { id: 'tankTop', name: 'Tank Top' },
        { id: 'microTee', name: 'Micro Tee' },
        { id: 'sweater', name: 'Sweater' },
        { id: 'boatNeck', name: 'Boat Neck LS' },
        { id: 'layered', name: 'Layered' },
        { id: 'bra', name: 'Bra' },
    ],

    topColors: [
        { id: 'white', name: 'White', color: '#F0F0F0' },
        { id: 'black', name: 'Black', color: '#1A1A1A' },
        { id: 'pink', name: 'Pink', color: '#FF69B4' },
        { id: 'red', name: 'Red', color: '#DC143C' },
        { id: 'blue', name: 'Blue', color: '#4169E1' },
        { id: 'lavender', name: 'Lavender', color: '#C4B5FD' },
        { id: 'cyan', name: 'Cyan', color: '#67E8F9' },
        { id: 'olive', name: 'Olive', color: '#6B8E23' },
    ],

    bottoms: [
        { id: 'pants', name: 'Pants' },
        { id: 'skirt', name: 'Skirt' },
        { id: 'microSkirt', name: 'Micro Skirt' },
        { id: 'miniShorts', name: 'Mini Shorts' },
        { id: 'jorts', name: 'Jorts' },
        { id: 'culottes', name: 'Culottes' },
        { id: 'longSkirt', name: 'Long Skirt' },
        { id: 'overalls', name: 'Overalls' },
    ],

    bottomColors: [
        { id: 'denim', name: 'Denim', color: '#4B6C98' },
        { id: 'black', name: 'Black', color: '#1A1A1A' },
        { id: 'white', name: 'White', color: '#F0F0F0' },
        { id: 'khaki', name: 'Khaki', color: '#C3B091' },
        { id: 'pink', name: 'Pink', color: '#FF69B4' },
        { id: 'plaid', name: 'Plaid', color: '#8B0000' },
        { id: 'olive', name: 'Olive', color: '#556B2F' },
        { id: 'lavender', name: 'Lavender', color: '#C4B5FD' },
    ],

    shoes: [
        { id: 'sneakers', name: 'Sneakers' },
        { id: 'boots', name: 'Boots' },
        { id: 'sandals', name: 'Sandals' },
        { id: 'platforms', name: 'Platforms' },
        { id: 'loafers', name: 'Loafers' },
    ],

    socks: [
        { id: 'none', name: 'None' },
        { id: 'ankle', name: 'Ankle' },
        { id: 'kneeHigh', name: 'Knee-High' },
        { id: 'thighHigh', name: 'Thigh-High' },
    ],
};

/** Default character state */
export function createDefaultCharacter() {
    return {
        skinTone: 'fair',
        hairStyle: 'short',
        hairColor: 'black',
        eyeType: 'round',
        eyeColor: 'brown',
        expression: 'neutral',
        top: 'microTee',
        topColor: 'white',
        bottom: 'jorts',
        bottomColor: 'denim',
        shoes: 'sneakers',
        socks: 'ankle',
        name: '',
    };
}
