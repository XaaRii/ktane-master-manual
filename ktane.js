/**
 * Global
 */
var ktane = ktane || {};

$('h2').on('dblclick', function () {
    $(this).closest('section').toggleClass('collapsed');
}).attr('title', 'Dvojklik pro schování/objevení karty');

/** Reset inputs */
ktane.resetInputs = function ($container) {
    $container.find('textarea').val('');
    $container.find('.selected').removeClass('selected');

    return $container.find('input').each(function () {
        if (this.type === 'text') {
            $(this).val('').trigger('keyup');
        } else if (this.type === 'checkbox') {
            this.checked = false;
        } else if (this.type === 'radio' && !this.value) {
            this.checked = true;
        }
    });
}

ktane.resetInputs($('body'));
$('.jsResetSection').on('click', function () {
    ktane.resetInputs($(this).closest('section')).filter('[type="text"]').first().focus();
});

/** Navigation */
$('section').each(function () {
    var $section = $(this),
        id = $section.attr('id'),
        $a = $('<a href="#' + id + '">' + $(this).find('h2').first().text() + '</a>').on('click', function () {
            $section.removeClass('collapsed');
        });

    id && $('#navList').append($('<li></li>').append($a));
});

(function () {
    /**
     * Wires
     */
    var count = {
        red: 0,
        yellow: 0,
        blue: 0,
        white: 0,
        black: 0
    },
        $wireList = $('#wireList');

    $('#wireOptions button').on('click', function () {
        var colour = this.getAttribute('data-colour'),
            letter = this.getAttribute('data-letter'),
            $li = $('<li><button class="button ' + colour + '" data-colour="' + colour
                + '" data-letter="' + letter + '"></button></li>');

        $wireList.append($li);
        count[colour]++;
        checkWireToCut();
    });

    $wireList.on('click', 'button', function () {
        var deleteIndex = $(this).parent().index();

        $wireList.children('li:eq(' + deleteIndex + '), li:gt(' + deleteIndex + ')').each(function () {
            var button = this.firstChild;
            count[button.getAttribute('data-colour')]--;
            $(this).remove();
        });

        checkWireToCut();
    });

    function checkWireToCut() {
        var lastColour = $wireList.children(':last-child').children().first().data('colour'),
            oddPossible;
        $wireList.find('.wireToCut').removeClass('wireToCut odd even');

        switch ($wireList.children().length) {
            case 3:
                oddPossible = false;

                if (!count['red']) {
                    addWireToCut(2);
                } else if (lastColour === 'white') {
                    addWireToCut();
                } else if (count['blue'] > 1) {
                    $wireList.find('[data-colour="blue"]').last().parent().addClass('wireToCut');
                } else {
                    addWireToCut();
                }
                break;
            case 4:
                oddPossible = count['red'] > 1;
                if (oddPossible) {
                    $wireList.find('[data-colour="red"]').parent().last().addClass('wireToCut odd');
                }

                if (lastColour === 'yellow' && !count['red'] || count['blue'] === 1) {
                    addWireToCut(1);
                } else if (count['yellow'] > 1) {
                    addWireToCut();
                } else {
                    addWireToCut(2);
                }
                break;
            case 5:
                oddPossible = lastColour === 'black';
                if (oddPossible) {
                    addWireToCut(4, 'odd');
                }

                if (count['red'] === 1 && count['yellow'] > 1) {
                    addWireToCut(1);
                } else if (!count['black']) {
                    addWireToCut(2);
                } else {
                    addWireToCut(1);
                }
                break;
            case 6:
                oddPossible = !count['yellow'];
                if (oddPossible) {
                    addWireToCut(3, 'odd');
                }

                if (count['yellow'] === 1 && count['white'] > 1) {
                    addWireToCut(4);
                } else if (!count['red']) {
                    addWireToCut();
                } else {
                    addWireToCut(4);
                }
                break;
            default:
                break;
        }

        function addWireToCut(child, className) {
            if (typeof className === 'undefined') {
                className = 'even';
            }
            $wireList.children(isNaN(child) ? ':last-child' : ':nth-child(' + child + ')')
                .addClass('wireToCut' + (className !== 'even' || oddPossible ? ' ' + className : ''));
        }
    }
})();

(function () {
    /**
     * Button
     */
    var $section = $('#sectionButton'),
        $instruction = $section.find('.instruction'),
        instruction;

    $section.find('input').on('click', function () {
        var colour = $('input[name="buttonColour"]:checked').val(),
            text = $('input[name="buttonText"]:checked').val();

        if (text === 'Detonate') {
            instruction = 'Pokud 2 a více \ud83d\udd0b, hned pusť.<br />Jinak podrž tlačítko.'
        } else if (colour === 'white') {
            instruction = 'Pokud je rozsvícený indikátor <span class="litIndicator" title="Lit indicator">CAR</span>, podrž tlačítko.<br />Jinak, pokud 3 a více \ud83d\udd0b a rozsvícený indikátor <span class="litIndicator" title="Lit indicator">FRK</span>, hned pusť.<br />Jinak podrž tlačítko.'
        } else if (colour === 'blue' && text === 'Abort'
            || colour === 'yellow') {
            instruction = 'Podrž tlačítko.';
        } else if (colour === 'red' && text === 'Hold') {
            instruction = 'Hned pusť.';
        } else {
            instruction = 'Pokud 3 a více \ud83d\udd0b a rozsvícený indikátor <span class="litIndicator" title="Lit indicator">FRK</span>, hned pusť tlačítko.<br />Jinak podrž tlačítko.';
        }

        $instruction.html(instruction);
    }).triggerHandler('click');
})();

(function () {
    /**
     * Keypads
     */
    var columns = [
        ['balloon', 'at', 'upsidedowny', 'squigglyn', 'squidknife', 'hookn', 'leftc'],
        ['euro', 'balloon', 'leftc', 'cursive', 'hollowstar', 'hookn', 'questionmark'],
        ['copyright', 'pumpkin', 'cursive', 'doublek', 'meltedthree', 'upsidedowny', 'hollowstar'],
        ['six', 'paragraph', 'bt', 'squidknife', 'doublek', 'questionmark', 'smileyface'],
        ['pitchfork', 'smileyface', 'bt', 'rightc', 'paragraph', 'dragon', 'filledstar'],
        ['six', 'euro', 'tracks', 'ae', 'pitchfork', 'nwithhat', 'omega']
    ],
        $section = $('#sectionKeypads'),
        $imageLists = {}; // name -> $('<img />')[]

    $.each(columns, function (i, column) {
        var $column = $('<ul data-count="0"></ul>');
        $section.append($column);

        $.each(column, function (i, name) {
            var $img = $('<img data-name="' + name + '" src="keypads/' + name + '.png" width="64" height="64" />');
            $column.append($('<li></li>').append($img));

            name in $imageLists
                ? $imageLists[name].push($img)
                : $imageLists[name] = [$img];
        });
    });

    $section.on('click', 'img', function () {
        var $img = $(this),
            name = $img.data('name'),
            endState = !$img.hasClass('selected'),
            offset = endState ? 1 : -1;

        $.each($imageLists[name], function (i, $img) {
            var $column = $img.parent().parent();
            $img.toggleClass('selected', endState);
            $column.attr('data-count', parseInt($column.attr('data-count'), 10) + offset);
        });
    });

    $section.find('.jsResetSection').on('click', function () {
        // Also need to reset the indices after removing .selected
        $section.find('ul').attr('data-count', 0);
    });
})();

(function () {
    /**
     * Simon
     */
    var $checkbox = $('#simonVowel'),
        $strikeButtons = $('#sectionSimon input[name="simonStrikes"]'),
        $arrows = [],
        mappings = [ // (hasVowel, strikes) -> list of visible arrows by ID
            // No vowel
            [
                ['RB', 'BY', 'YR'],
                ['GY', 'YG'],
                ['RY', 'BG', 'GB', 'YR']
            ],
            // Vowel
            [
                ['RB', 'BR', 'GY', 'YG'],
                ['RY', 'BG', 'GB', 'YR'],
                ['RG', 'BR', 'GY', 'YB']
            ]
        ];

    $('#simonBoard').find('.arrow').each(function (i, arrow) {
        $arrows[arrow.id.replace(/^.*(?=..$)/, '')] = $(arrow);
    });

    $('#sectionSimon input').on('change', function () {
        var hasVowel = +$checkbox.prop('checked'),
            strikes = $strikeButtons.filter(':checked').val();

        for (var id in $arrows) {
            $arrows[id].removeClass('active');
        }

        $.each(mappings[hasVowel][strikes], function (i, id) {
            $arrows[id].addClass('active');
        });
    }).first().trigger('change');
})();

(function () {
    /**
     * Who's on First
     */
    var TL = 'levá horní',
        TR = 'pravá horní',
        ML = 'levá prostřední',
        MR = 'pravá prostřední',
        BL = 'levá spodní',
        BR = 'pravá spodní',
        displays = {
            '\u00a0': MR,
            'ANO': ML,
            'ÁŇO': ML,
            'BILI': ML,
            'BILY': BR,
            'BÍLÍ': BR,
            'BYLY': TR,
            'C': MR,
            'CÉ': BR,
            'ČEKEJ': BR,
            'DRŽ': BR,
            'HOLD': ML,
            'HOLT': BR,
            'LED': BR,
            'LET': MR,
            'MĚ': BR,
            'MNĚ': TR,
            'MÍT': MR,
            'MÝT': BL,
            'NIC': BL,
            'OK': MR,
            'OKA': TL,
            'POČKAT': MR,
            'POČKEJ': BL,
            'PRÁZDNO': BR,
            'VYDRŽ': MR,
            'VÝDRŽ': TR,
            'VÝT': BL,
        },
        sequence = {
            'A': 'ÁŇO, POSLEDNÍ, NE, KDY JSI, NUŽ, TYS, A',
            'AH': 'LEVÁ, AH',
            'AHHH': 'PRAVÁ, AHHH',
            'ANO': 'OKA, PRAVÁ, LEVÁ, NŮŽ, PRVNÍ, AH, OK, UŽ, CO, ANO',
            'ÁŇO': 'DALŠÍ, NUŽ, HA HAH, KDY JSI, HA HA, JISTĚ, NE, TY JSI, KDYS, POSLEDNÍ, CO?, A, ÁŇO',
            'ČEKEJ': 'LEVÁ, NIC, PRÁZDNO, OKA, ANO, AHHH, PRVNÍ, OK, AH, ČEKEJ',
            'CO': 'LEVÁ, PRAVÁ, OKA, NŮŽ, ANO, PRÁZDNO, NIC, OK, AHHH, AH, ČEKEJ, PRVNÍ, CO',
            'CO?': 'JISTĚ, HA HA, CO?',
            'DALŠÍ': 'TYS, KDYS, KDY JSI, HA HAH, A, POSLEDNÍ, CO?, NUŽ, ÁŇO, DALŠÍ',
            'HA HA': 'POSLEDNÍ, TYS, A, ÁŇO, HA HAH, CO?, NE, JISTĚ, HA HA',
            'HA HAH': 'DALŠÍ, HA HAH',
            'JISTĚ': 'TYS, POSLEDNÍ, A, ÁŇO, KDY JSI, CO?, HA HAH, NUŽ, TY JSI, DALŠÍ, HA HA, KDYS, NE, JISTĚ',
            'KDYS': 'KDY JSI, A, TY JSI, POSLEDNÍ, ÁŇO, JISTĚ, NE, NUŽ, DALŠÍ, HA HA, HA HAH, TYS, CO?, KDYS',
            'KDY JSI': 'NE, KDYS, POSLEDNÍ, KDY JSI',
            'LEVÁ': 'UŽ, CO, AHHH, AH, OKA, ANO, PRAVÁ, NIC, OK, PRÁZDNO, LEVÁ',
            'NE': 'CO?, HA HA, KDYS, HA HAH, A, NE',
            'NIC': 'PRÁZDNO, LEVÁ, ČEKEJ, PRVNÍ, AH, UŽ, PRAVÁ, ANO, CO, AHHH, OK, OKA, NIC',
            'NUŽ': 'KDYS, HA HA, JISTĚ, NE, DALŠÍ, CO?, TYS, ÁŇO, HA HAH, A, NUŽ',
            'NŮŽ': 'PRÁZDNO, UŽ, OKA, AH, CO, OK, NIC, ČEKEJ, AHHH, NŮŽ',
            'OK': 'PRAVÁ, NŮŽ, ANO, UŽ, OK',
            'OKA': 'NŮŽ, NIC, PRVNÍ, ANO, LEVÁ, CO, ČEKEJ, OKA',
            'POSLEDNÍ': 'POSLEDNÍ',
            'PRAVÁ': 'ANO, CO, UŽ, OK, NIC, ČEKEJ, AH, PRAVÁ',
            'PRÁZDNO': 'ČEKEJ, PRAVÁ, OKA, NŮŽ, PRÁZDNO',
            'PRVNÍ': 'AHHH, OKA, ANO, NŮŽ, NIC, PRAVÁ, CO, LEVÁ, ČEKEJ, UŽ, PRÁZDNO, AH, OK, PRVNÍ',
            'UŽ': 'ANO, OKA, AH, NŮŽ, AHHH, OK, PRAVÁ, PRÁZDNO, UŽ',
            'TYS': 'KDYS, JISTĚ, TY JSI, HA HAH, DALŠÍ, NUŽ, POSLEDNÍ, CO?, TYS',
            'TY JSI': 'HA HAH, A, HA HA, CO?, NUŽ, JISTĚ, NE, ÁŇO, POSLEDNÍ, DALŠÍ, TY JSI',
        },
        $list = $('#wofList'),
        $table = $('#wofTable'),
        $displays = {},
        $rows = {};

    $.each(displays, function (word, location) {
        var $dt = $('<dt>' + word + '</dt>');
        $list.append($dt)
            .append($('<dd>' + location + '</dd>'));
        $displays[word] = $dt;
    });

    $.each(sequence, function (word, sequence) {
        var $row = $('<tr></tr>')
            .append('<th>"' + word + '":</th>')
            .append('<td>' + sequence + '</td>');
        $table.append($row);
        $rows[word] = $row;
    });

    $('#wofInput').on('keyup', function () {
        var value = this.value.replace(/^ +|[^a-z ']$/i, '').toUpperCase();
        this.value = value;

        $.each($displays, function (word, $dt) {
            $dt.removeClass('inactive');
        });
        $.each($rows, function (word, $row) {
            $row.removeClass('inactive');
        });

        if (!value) {
            return;
        }

        $.each($displays, function (word, $dt) {
            word.indexOf(value) !== 0 && $dt.addClass('inactive');
        });

        $.each($rows, function (word, $row) {
            word.indexOf(value) !== 0 && $row.addClass('inactive');
        });
    });
})();

(function () {
    /**
     * Memory
     */
    var inputRegex = /^[1-4]$/,
        $s = {}, // Cache jQuery objects for speed and convenience
        answerData;

    for (var i = 1; i <= 5; i++) {
        $s[i] = {
            d: $('#stage_' + i + '_display'),
            p: $('#stage_' + i + '_pos'),
            l: $('#stage_' + i + '_label')
        };

        if (i < 5) {
            $s[i].p.add($s[i].l).on('keyup', { j: i + 1 }, function (e) {
                if (inputRegex.test(this.value)) {
                    $s[e.data.j].d.focus();
                }
            });
        }
    }

    $('#sectionMemory input').on('focus', function () {
        this.select();
    });

    answerData = { // {stage -> {display -> [element, value]} }
        1: {
            1: ['p', 2],
            2: ['p', 2],
            3: ['p', 3],
            4: ['p', 4]
        },
        2: {
            1: ['l', 4],
            2: ['p', $s[1].p],
            3: ['p', 1],
            4: ['p', $s[1].p]
        },
        3: {
            1: ['l', $s[2].l],
            2: ['l', $s[1].l],
            3: ['p', 3],
            4: ['l', 4]
        },
        4: {
            1: ['p', $s[1].p],
            2: ['p', 1],
            3: ['p', $s[2].p],
            4: ['p', $s[2].p]
        },
        5: {
            1: ['l', $s[1].l],
            2: ['l', $s[2].l],
            3: ['l', $s[4].l],
            4: ['l', $s[3].l]
        }
    };

    $('#sectionMemory input[id$="_display"]').on('keyup', function () {
        if (!inputRegex.test(this.value)) {
            return;
        }

        var index = parseInt(this.getAttribute('data-index'), 10),
            data = answerData[index][this.value],
            element = $s[index][data[0]],
            value = data[1];

        if (typeof value === 'object') {
            value = value.val() || value.attr('id').replace(/(\d).+$/, '$1');
        }

        element.val(value);
        $s[index][data[0] === 'p' ? 'l' : 'p'].focus();
    });
})();

(function () {
    /**
     * Morse
     */
    var freqs = {
        'prach': '3.505',
        'chleba': '3.515',
        'klenba': '3.522',
        'stest': '3.532',
        'klacek': '3.535',
        'plomba': '3.542',
        'strop': '3.545',
        'shluk': '3.552',
        'mozol': '3.555',
        'mozek': '3.565',
        'houby': '3.572',
        'sklep': '3.575',
        'strach': '3.582',
        'bahno': '3.592',
        'strup': '3.595',
        'brach': '3.600'
    },
        codes = {
            '.-': 'a',
            '-...': 'b',
            '-.-.': 'c',
            '.': 'e',
            '..-.': 'f',
            '--.': 'g',
            '....': 'h',
            '..': 'i',
            '-.-': 'k',
            '.-..': 'l',
            '--': 'm',
            '-.': 'n',
            '---': 'o',
            '.-.': 'r',
            '...': 's',
            '-': 't',
            '...-': 'v',
            '-..-': 'x',
            '--..': 'z'
        },
        codeRegex = new RegExp(' *(' + Object.keys(codes).join('|').replace(/\./g, '\\.') + ')(?![\.-]) *', 'g'),
        $rows = {},
        $table = $('#morseTable');

    for (var word in freqs) {
        var $row = $('<tr><td>' + word + '</td><td>' + freqs[word] + '</td></tr>');
        $table.append($row);
        $rows[word + word] = $row; // Concat to handle the wrap around
    }

    $('#morseInput').on('keyup', function () {
        var lines = this.value.split('\n'),
            regexes = [];

        lines.forEach(function (line) {
            if (!line) return;

            // JS has no negative lookbehind; gotta do the replacement twice
            regexes.push(new RegExp(
                line.replace(codeRegex, codeRegexCallback)
                    .replace(codeRegex, codeRegexCallback)
            ));
        });
        console.log(regexes);

        for (var word in $rows) {
            var matchAll = true;
            $.each(regexes, function (i, regex) {
                if (!regex.test(word)) {
                    matchAll = false;
                    return false;
                }
            });

            $rows[word].toggleClass('inactive', !matchAll);
        }
    });

    function codeRegexCallback(match, code) {
        return codes[code];
    }
})();

(function () {
    /**
     * Wire sequence
     */
    var $instructions = $('#sequenceInstruction'),
        count = {
            red: 0,
            blue: 0,
            black: 0
        },
        occurrences = {
            red: ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'],
            blue: ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'],
            black: ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C']
        };

    $('#sequenceOptions button').on('click', function () {
        var colour = this.getAttribute('data-colour'),
            letter = this.getAttribute('data-letter'),
            $li = $('<li><button class="button ' + colour + '" data-colour="' + colour + '" data-letter="' + letter
                + '">' + letter + '</button></li>');

        if (typeof occurrences[colour][count[colour]] !== 'undefined') {
            $li.append(occurrences[colour][count[colour]].indexOf(letter) === -1 ? 'Ignoruj' : 'Přestřihni');
            count[colour]++;
            $instructions.append($li);
        }
    });

    $instructions.on('click', 'button', function () {
        var deleteIndex = $(this).parent().index();

        $instructions.children('li:eq(' + deleteIndex + '), li:gt(' + deleteIndex + ')').each(function () {
            var button = this.firstChild;
            count[button.getAttribute('data-colour')]--;
            $(this).remove();
        });
    });
})();

(function () {
    /**
     * Venn diagram
     */
    var instructions = {
        C: 'Přestřihni',
        D: '<strong>NESTŘÍHEJ</strong>',
        S: 'Pokud je seriové číslo sudé, přestřihni',
        P: 'Pokud je na bombě paralelní port, přestřihni',
        B: 'Pokud jsou 2 a více \ud83d\udd0b, přestřihni'
    },
        conditions = { // Initialize
            false: {
                false: {
                    false: {}, true: {}
                },
                true: {
                    false: {}, true: {}
                }
            },
            true: {
                false: {
                    false: {}, true: {}
                },
                true: {
                    false: {}, true: {}
                }
            }
        },
        $checkboxes = $('#vennOptions input[type="checkbox"]'),
        $instruction = $('#sectionVenn .instruction');

    //         Red    Blue   Star   LED
    conditions[false][false][false][false] = 'C';
    conditions[false][false][false][true] = 'D';
    conditions[false][false][true][false] = 'C';
    conditions[false][false][true][true] = 'B';
    conditions[false][true][false][false] = 'S';
    conditions[false][true][false][true] = 'P';
    conditions[false][true][true][false] = 'D';
    conditions[false][true][true][true] = 'P';
    conditions[true][false][false][false] = 'S';
    conditions[true][false][false][true] = 'B';
    conditions[true][false][true][false] = 'C';
    conditions[true][false][true][true] = 'B';
    conditions[true][true][false][false] = 'S';
    conditions[true][true][false][true] = 'S';
    conditions[true][true][true][false] = 'P';
    conditions[true][true][true][true] = 'D';

    $checkboxes.on('change', function () {
        var checked = [];
        $checkboxes.each(function () {
            checked.push(this.checked);
        });

        $instruction.html(instructions[conditions[checked[0]][checked[1]][checked[2]][checked[3]]]);
    }).triggerHandler('change');
})();

(function () {
    /**
     * Alternate Venn diagram
     */
    var $doCut = $('#venn2DoCut'),
        $doNotCut = $('#venn2DoNotCut'),
        $checkboxes = $('#sectionVenn2 input[type="checkbox"]'),
        $serialEven = $('#venn2SerialEven'),
        $parallelExists = $('#venn2ParallelExists'),
        $multipleBatteries = $('#venn2MultipleBatteries');

    $checkboxes.on('change', function () {
        var $serialList,
            $parallelList,
            $batteryList;

        $doCut.empty();
        $doNotCut.empty();

        $serialList = $serialEven.prop('checked') ? $doCut : $doNotCut;
        $parallelList = $parallelExists.prop('checked') ? $doCut : $doNotCut;
        $batteryList = $multipleBatteries.prop('checked') ? $doCut : $doNotCut;

        addRow($doCut, [
            {},
            { star: true },
            { red: true, star: true }
        ]);
        addRow($doNotCut, [
            { light: true },
            { blue: true, light: true },
            { red: true, blue: true, star: true, light: true }
        ]);
        addRow($serialList, [
            { red: true },
            { blue: true },
            { red: true, blue: true },
            { red: true, blue: true, light: true }
        ]);
        addRow($parallelList, [
            { blue: true, light: true },
            { red: true, blue: true, star: true },
            { blue: true, star: true, light: true }
        ]);
        addRow($batteryList, [
            { red: true, light: true },
            { star: true, light: true },
            { red: true, star: true, light: true }
        ]);
    }).triggerHandler('change');

    function addRow($table, items) {
        $.each(items, function (i, item) {
            var $tr = $('<tr></tr>');
            $tr.append($('<td>' + (item.star ? '★' : '') + '</td>'));
            $tr.append($('<td' + (item.red ? ' class="red"' : '') + '></td>'));
            $tr.append($('<td' + (item.blue ? ' class="blue"' : '') + '></td>'));
            $tr.append($('<td>' + (item.light ? '💡' : '') + '</td>'));
            $table.append($tr);
        });
    }
})();

(function () {
    /**
     * Passwords
     * */
    var passwords = [
        'agent', 'barva', 'budík', 'copak', 'domov',
        'dráha', 'hokej', 'hvozd', 'kabel', 'kočka',
        'kolem', 'kosti', 'lustr', 'místo', 'okolo',
        'pokoj', 'pomoc', 'pozdě', 'praha', 'práce',
        'právo', 'písek', 'rehek', 'skála', 'strom',
        'strop', 'škola', 'šperk', 'tráva', 'vazba',
        'volat', 'volba', 'zájem', 'zásah', 'škála'
    ],
        $passwordContainer = $('#passwords'),
        $passwords = [],
        $row,
        $inputs = $('#passwordOptions > li > input');

    passwords.forEach(function (password, i) {
        var $cell;
        if (i % 5 === 0) {
            $row = $('<tr></tr>').appendTo($passwordContainer);
        }

        $cell = $('<td>' + password + '</td>').appendTo($row);
        $passwords.push($cell);
    });

    $inputs.on('keyup', function () {
        var pattern = '^',
            regex;
        this.value = this.value.replace(/[^a-z]/gi, '').toLowerCase();
        $inputs.each(function (i, input) {
            pattern += input.value ? '[' + input.value + ']' : '.';
        });
        pattern += '$';
        regex = new RegExp(pattern);

        $passwords.forEach(function ($password) {
            $password.toggleClass('inactive', !$password.text().match(regex));
        });
    });
})();


(function () {
    /**
     * Maze
     */
    var columns = [
        ['16', '15', '14', '13', '12', '11'],
        ['26', '25', '24', '23', '22', '21'],
        ['36', '35', '34', '33', '32', '31'],
        ['46', '45', '44', '43', '42', '41'],
        ['56', '55', '54', '53', '52', '51'],
        ['66', '65', '64', '63', '62', '61']
    ],
        $section = $('#sectionMaze'),
        $imageLists = {}; // name -> $('<img />')[]

    var $bglines = $('<div id="mazebg" class="mazebg"></div>');
    $section.append($bglines);
    $.each(columns, function (i, column) {
        var $column = $('<ul data-count="0"></ul>');
        $bglines.append($column);

        $.each(column, function (i, name) {
            var $img = $('<img data-name="' + name + '" src="maze/dot.png" width="30" height="30" />');
            $column.append($('<li></li>').append($img));

            name in $imageLists
                ? $imageLists[name].push($img)
                : $imageLists[name] = [$img];
        });
    });

    var $checkbox = $('#mazeMark')
    var marker
    var chosen = false

    $('#sectionMaze input').on('change', function () {
        marker = +$checkbox.prop('checked');
    }).first().trigger('change');

    $section.on('click', 'img', function () {
        var $img = $(this),
            name = $img.data('name'),
            endState = !$img.hasClass('selected');

        if (!marker) {
            $img.toggleClass('selected', endState);
            var pairs = [[15, 64], [23, 55], [43, 63], [13, 16], [41, 54], [32, 56], [21, 26], [33, 46], [12, 35]]
            var secondary
            for (let i = 0; i < pairs.length; i++) {
                if (pairs[i].includes(name)) {
                    pairs[i][0] == (name) ? secondary = pairs[i][1] : secondary = pairs[i][0]
                    $.each($imageLists[secondary], function (i, $img) {
                        $img.toggleClass('hinted', endState)
                    });
                    document.getElementById('mazebg').style.backgroundImage = "url(maze/maze" + i + ".svg)";
                }
            }
            if (!endState && name == chosen) { // newly desel
                chosen = false
                document.getElementById('mazebg').style.backgroundSize = "0px";
            }
            if (endState && chosen == false && secondary) { // newly sel
                chosen = name
                document.getElementById('mazebg').style.backgroundSize = "180px";
            }
        } else {
            $img.toggleClass('marked');
        }


    });

    $section.find('.jsResetSection').on('click', function () {
        // Also need to reset the indices after removing .selected
        $section.find('ul').attr('data-count', 0);
        $.each($imageLists, function (i, $img) {
            $.each($img, function (i, $img) {
                if ($img.hasClass('hinted')) $img.toggleClass('hinted')
                if ($img.hasClass('marked')) $img.toggleClass('marked')
            });
        });
        document.getElementById('mazebg').style.backgroundImage = "";
        marker = 0;
        chosen = false
    });
})();


(function () {
    /**
     * Knobs
     */

    var U = 'horní',
        D = 'spodní',
        L = 'levá',
        R = 'pravá',
        disp = {
            '  X XXXXXX X': U,
            'X X X  XX XX': U,
            ' XX  XXXXX X': D,
            'X X X  X   X': D,
            '    X X  XXX': L,
            '    X    XX ': L,
            'X XXXXXXX X ': R,
            'X XX  XXX X ': R,
        },
        $list = $('#knobList'),
        $disp = {},
        $rows = {};

    $.each(disp, function (word, location) {
        var $dt = $('<dt>' + word + '</dt>');
        $list.append($dt)
            .append($('<dd>' + location + '</dd>'));
        $disp[word] = $dt;
    });

    $('#knobInput').on('keyup', function () {
        var value = this.value.replace(/[^xX ]+/g, '').toUpperCase();
        this.value = value;

        var value = this.value.toUpperCase();
        this.value = value;

        $.each($disp, function (word, $dt) {
            $dt.removeClass('inactive');
        });
        $.each($rows, function (word, $row) {
            $row.removeClass('inactive');
        });

        if (!value) {
            return;
        }

        $.each($disp, function (word, $dt) {
            word.indexOf(value) !== 0 && $dt.addClass('inactive');
        });

        $.each($rows, function (word, $row) {
            word.indexOf(value) !== 0 && $row.addClass('inactive');
        });
    });
})();