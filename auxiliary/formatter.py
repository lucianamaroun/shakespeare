'''This module is used charge to format the result from the database in order to
show it with bold tags between the searched word'''
import re


def apply_tag_to_pattern(pattern, tag, text):
    '''Applies a tag into all ocurrences of a word in a given text.

    Args:
        pattern: Regex used to find the word in which the tag should be
            applied.
        tag: Tag to be applied. Ex: b for bolding.
        text: The text in which this processing is going to be executed.

    Returns:
        The text with the tag applied into the desired words.'''
    formatted_text = text
    matches = set(re.findall(pattern, text))
    for match in matches:
        formatted_text = re.sub(
            '\\b' + match + '\\b', '<%s>%s</%s>' % (tag, match, tag),
            formatted_text)
    return formatted_text

def get_any_case_word_regex(word):
    '''Given a word, this method will create a regex capable of matching it
    disregarding its case.

    All the posible combination of the word with capital or regular letters
    will be matched.

    Args:
        The word to match, with any capital state.

    Returns:
        A regex.'''
    regex = '\\b'
    for letter in word.lower():
        regex += '[' + letter + letter.upper() + ']'
    regex += '\\b'
    return regex
