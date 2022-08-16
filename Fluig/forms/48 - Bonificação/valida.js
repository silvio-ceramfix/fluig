var somaParcela;
var task;

var beforeSendValidate = function(numState, nextState) {

	var msg = '';

	var valida = validaAba(aba);
	if (!valida) {
		return false;
	}

	return true;

};

function validaCliente(cliente) {
	if (cliente == undefined || cliente == null || cliente == '') {
		return false;
	}
}

function exibeLinhas(parcela) {

	$("input[name^='parcelaID___']").each(function() {
		var atual = $(this).val() // Conteudo gravado no campo hidden,
		// corresponde a parcela
		var seq = $(this).attr('name').split('___')[1];

		if ($(this).attr('name').indexOf("___") > 0) // acha o conteudo
		// dentro de uma string
		{
			if (atual == parcela) {
				$('#linhaTabela___' + seq).show();
				$('#lstPreco').val($('#listaID___' + seq).val()); // carrega a
				// lista de
				// preço
				// quando é
				// trocado a
				// parcela
			} else {
				$('#linhaTabela___' + seq).hide();
			}
		}
	});

}

function fnCustomDelete(oElement) {
	fnWdkRemoveChild(oElement);
	console.log('oElement', oElement)
	validainvest();
	calculaTotParcela();
}

function validainvest() {

	document.getElementById("val_invest").readOnly = false;

	$("input[name^='listaID___']").each(function() {

		document.getElementById("val_invest").readOnly = true;
	});
}

// ########## IE #############
var OrdZero = '0'.charCodeAt(0);

function CharToInt(ch) {
	return ch.charCodeAt(0) - OrdZero;
}

function IntToChar(intt) {
	return String.fromCharCode(intt + OrdZero);
}

function CheckIEAC(ie) {
	if (ie.length != 13)
		return false;
	var b = 4, soma = 0;

	for (var i = 0; i <= 10; i++) {
		soma += CharToInt(ie.charAt(i)) * b;
		--b;
		if (b == 1) {
			b = 9;
		}
	}
	dig = 11 - (soma % 11);
	if (dig >= 10) {
		dig = 0;
	}
	resultado = (IntToChar(dig) == ie.charAt(11));
	if (!resultado) {
		return false;
	}
	b = 5;
	soma = 0;
	for (var i = 0; i <= 11; i++) {
		soma += CharToInt(ie.charAt(i)) * b;
		--b;
		if (b == 1) {
			b = 9;
		}
	}
	dig = 11 - (soma % 11);
	if (dig >= 10) {
		dig = 0;
	}
	if (IntToChar(dig) == ie.charAt(12)) {
		return true;
	} else {
		return false;
	}
} // AC

function CheckIEAL(ie) {
	if (ie.length != 9)
		return false;
	var b = 9, soma = 0;
	for (var i = 0; i <= 7; i++) {
		soma += CharToInt(ie.charAt(i)) * b;
		--b;
	}
	soma *= 10;
	dig = soma - Math.floor(soma / 11) * 11;
	if (dig == 10) {
		dig = 0;
	}
	return (IntToChar(dig) == ie.charAt(8));
} // AL

function CheckIEAM(ie) {
	if (ie.length != 9)
		return false;
	var b = 9, soma = 0;
	for (var i = 0; i <= 7; i++) {
		soma += CharToInt(ie.charAt(i)) * b;
		b--;
	}
	if (soma < 11) {
		dig = 11 - soma;
	} else {
		i = soma % 11;
		if (i <= 1) {
			dig = 0;
		} else {
			dig = 11 - i;
		}
	}
	return (IntToChar(dig) == ie.charAt(8));
} // AM

function CheckIEAP(ie) {
	if (ie.length != 9)
		return false;
	var p = 0, d = 0, i = ie.substring(1, 8);
	if ((i >= 3000001) && (i <= 3017000)) {
		p = 5;
		d = 0;
	} else if ((i >= 3017001) && (i <= 3019022)) {
		p = 9;
		d = 1;
	}
	b = 9;
	soma = p;
	for (var i = 0; i <= 7; i++) {
		soma += CharToInt(ie.charAt(i)) * b;
		b--;
	}
	dig = 11 - (soma % 11);
	if (dig == 10) {
		dig = 0;
	} else if (dig == 11) {
		dig = d;
	}
	return (IntToChar(dig) == ie.charAt(8));
} // AP

function CheckIEBA(ie) {
	if (ie.length != 8)
		return false;
	die = ie.substring(0, 8);
	var nro = new Array(8);
	var dig = -1;
	for (var i = 0; i <= 7; i++) {
		nro[i] = CharToInt(die.charAt(i));
	}
	var NumMod = 0;
	if (String(nro[0]).match(/[0123458]/))
		NumMod = 10;
	else
		NumMod = 11;
	b = 7;
	soma = 0;
	for (i = 0; i <= 5; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % NumMod;
	if (NumMod == 10) {
		if (i == 0) {
			dig = 0;
		} else {
			dig = NumMod - i;
		}
	} else {
		if (i <= 1) {
			dig = 0;
		} else {
			dig = NumMod - i;
		}
	}
	resultado = (dig == nro[7]);
	if (!resultado) {
		return false;
	}
	b = 8;
	soma = 0;
	for (i = 0; i <= 5; i++) {
		soma += nro[i] * b;
		b--;
	}
	soma += nro[7] * 2;
	i = soma % NumMod;
	if (NumMod == 10) {
		if (i == 0) {
			dig = 0;
		} else {
			dig = NumMod - i;
		}
	} else {
		if (i <= 1) {
			dig = 0;
		} else {
			dig = NumMod - i;
		}
	}
	return (dig == nro[6]);
} // BA

function CheckIECE(ie) {
	if (ie.length > 9)
		return false;
	die = ie;
	if (ie.length < 9) {
		while (die.length <= 8)
			die = '0' + die;
	}
	var nro = Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(die[i]);
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	dig = 11 - (soma % 11);
	if (dig >= 10)
		dig = 0;
	return (dig == nro[8]);
} // CE

function CheckIEDF(ie) {
	if (ie.length != 13)
		return false;
	var nro = new Array(13);
	for (var i = 0; i <= 12; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 4;
	soma = 0;
	for (i = 0; i <= 10; i++) {
		soma += nro[i] * b;
		b--;
		if (b == 1)
			b = 9;
	}
	dig = 11 - (soma % 11);
	if (dig >= 10)
		dig = 0;
	resultado = (dig == nro[11]);
	if (!resultado)
		return false;
	b = 5;
	soma = 0;
	for (i = 0; i <= 11; i++) {
		soma += nro[i] * b;
		b--;
		if (b == 1)
			b = 9;
	}
	dig = 11 - (soma % 11);
	if (dig >= 10)
		dig = 0;
	return (dig == nro[12]);
}

function CheckIEES(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i < 2)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
}

function CheckIEGO(ie) {
	if (ie.length != 9)
		return false;
	s = ie.substring(0, 2);
	if ((s == '10') || (s == '11') || (s == '15')) {
		var nro = new Array(9);
		for (var i = 0; i <= 8; i++)
			nro[i] = CharToInt(ie.charAt(i));
		n = Math.floor(ie / 10);
		if (n = 11094402) {
			if ((nro[8] == 0) || (nro[8] == 1))
				return true;
		}
		b = 9;
		soma = 0;
		for (i = 0; i <= 7; i++) {
			soma += nro[i] * b;
			b--;
		}
		i = soma % 11;
		if (i == 0)
			dig = 0;
		else {
			if (i == 1) {
				if ((n >= 10103105) && (n <= 10119997))
					dig = 1;
				else
					dig = 0;
			} else
				dig = 11 - i;
		}
		return (dig == nro[8]);
	}
}

function CheckIEMA(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
}

function CheckIEMT(ie) {
	if (ie.length < 9)
		return false;
	die = ie;
	if (die.length < 11) {
		while (die.length <= 10)
			die = '0' + die;
		var nro = new Array(11);
		for (var i = 0; i <= 10; i++)
			nro[i] = CharToInt(die[i]);
		b = 3;
		soma = 0;
		for (i = 0; i <= 9; i++) {
			soma += nro[i] * b;
			b--;
			if (b == 1)
				b = 9;
		}
		i = soma % 11;
		if (i <= 1)
			dig = 0;
		else
			dig = 11 - i;
		return (dig == nro[10]);
	}
} // MT

function CheckIEMS(ie) {
	if (ie.length != 9)
		return false;
	if (ie.substring(0, 2) != '28')
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
} // MS

function CheckIEPA(ie) {
	if (ie.length != 9)
		return false;
	if (ie.substring(0, 2) != '15')
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
} // PA

function CheckIEPB(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
} // PB

function CheckIEPR(ie) {
	if (ie.length != 10)
		return false;
	var nro = new Array(10);
	for (var i = 0; i <= 9; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 3;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
		if (b == 1)
			b = 7;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	resultado = (dig == nro[8]);
	if (!resultado)
		return false;
	b = 4;
	soma = 0;
	for (i = 0; i <= 8; i++) {
		soma += nro[i] * b;
		b--;
		if (b == 1)
			b = 7;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[9]);
} // PR

function CheckIEPE(ie) {
	if (ie.length != 14)
		return false;
	var nro = new Array(14);
	for (var i = 0; i <= 13; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 5;
	soma = 0;
	for (i = 0; i <= 12; i++) {
		soma += nro[i] * b;
		b--;
		if (b == 0)
			b = 9;
	}
	dig = 11 - (soma % 11);
	if (dig > 9)
		dig = dig - 10;
	return (dig == nro[13]);
} // PE

function CheckIEPI(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
} // PI

function CheckIERJ(ie) {
	if (ie.length != 8)
		return false;
	var nro = new Array(8);
	for (var i = 0; i <= 7; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 2;
	soma = 0;
	for (i = 0; i <= 6; i++) {
		soma += nro[i] * b;
		b--;
		if (b == 1)
			b = 7;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[7]);
} // RJ

function CheckIERN(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	soma *= 10;
	dig = soma % 11;
	if (dig == 10)
		dig = 0;
	return (dig == nro[8]);
} // RN

function CheckIERS(ie) {
	if (ie.length != 10)
		return false;
	i = ie.substring(0, 3);
	if ((i >= 1) && (i <= 467)) {
		var nro = new Array(10);
		for (var i = 0; i <= 9; i++)
			nro[i] = CharToInt(ie.charAt(i));
		b = 2;
		soma = 0;
		for (i = 0; i <= 8; i++) {
			soma += nro[i] * b;
			b--;
			if (b == 1)
				b = 9;
		}
		dig = 11 - (soma % 11);
		if (dig >= 10)
			dig = 0;
		return (dig == nro[9]);
	} // if i&&i
} // RS

function CheckIEROantigo(ie) {
	if (ie.length != 9) {
		return false;
	}
	var nro = new Array(9);
	b = 6;
	soma = 0;
	for (var i = 3; i <= 8; i++) {
		nro[i] = CharToInt(ie.charAt(i));
		if (i != 8) {
			soma = soma + (nro[i] * b);
			b--;
		}
	}
	dig = 11 - (soma % 11);
	if (dig >= 10)
		dig = dig - 10;
	return (dig == nro[8]);
} // RO-antiga

function CheckIERO(ie) {
	if (ie.length != 14) {
		return false;
	}
	var nro = new Array(14);
	b = 6;
	soma = 0;

	for (var i = 0; i <= 4; i++) {
		nro[i] = CharToInt(ie.charAt(i));
		soma = soma + (nro[i] * b);
		b--;
	}

	b = 9;
	for (var i = 5; i <= 13; i++) {
		nro[i] = CharToInt(ie.charAt(i));
		if (i != 13) {
			soma = soma + (nro[i] * b);
			b--;
		}
	}
	dig = 11 - (soma % 11);
	if (dig >= 10)
		dig = dig - 10;
	return (dig == nro[13]);
} // RO nova

function CheckIERR(ie) {
	if (ie.length != 9)
		return false;
	if (ie.substring(0, 2) != '24')
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	var soma = 0;
	var n = 0;
	for (i = 0; i <= 7; i++)
		soma += nro[i] * ++n;
	dig = soma % 9;
	return (dig == nro[8]);
} // RR

function CheckIESC(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	i = soma % 11;
	if (i <= 1)
		dig = 0;
	else
		dig = 11 - i;
	return (dig == nro[8]);
} // SC

function CheckIESP(ie) {
	if (((ie.substring(0, 1)).toUpperCase()) == 'P') {
		s = ie.substring(1, 9);
		var nro = new Array(12);
		for (var i = 0; i <= 7; i++)
			nro[i] = CharToInt(s[i]);
		soma = (nro[0] * 1) + (nro[1] * 3) + (nro[2] * 4) + (nro[3] * 5)
				+ (nro[4] * 6) + (nro[5] * 7) + (nro[6] * 8) + (nro[7] * 10);
		dig = soma % 11;
		if (dig >= 10)
			dig = 0;
		resultado = (dig == nro[8]);
		if (!resultado)
			return false;
	} else {
		if (ie.length < 12)
			return false;
		var nro = new Array(12);
		for (var i = 0; i <= 11; i++)
			nro[i] = CharToInt(ie.charAt(i));
		soma = (nro[0] * 1) + (nro[1] * 3) + (nro[2] * 4) + (nro[3] * 5)
				+ (nro[4] * 6) + (nro[5] * 7) + (nro[6] * 8) + (nro[7] * 10);
		dig = soma % 11;
		if (dig >= 10)
			dig = 0;
		resultado = (dig == nro[8]);
		if (!resultado)
			return false;
		soma = (nro[0] * 3) + (nro[1] * 2) + (nro[2] * 10) + (nro[3] * 9)
				+ (nro[4] * 8) + (nro[5] * 7) + (nro[6] * 6) + (nro[7] * 5)
				+ (nro[8] * 4) + (nro[9] * 3) + (nro[10] * 2);
		dig = soma % 11;
		if (dig >= 10)
			dig = 0;
		return (dig == nro[11]);
	}
} // SP

function CheckIESE(ie) {
	if (ie.length != 9)
		return false;
	var nro = new Array(9);
	for (var i = 0; i <= 8; i++)
		nro[i] = CharToInt(ie.charAt(i));
	b = 9;
	soma = 0;
	for (i = 0; i <= 7; i++) {
		soma += nro[i] * b;
		b--;
	}
	dig = 11 - (soma % 11);
	if (dig >= 10)
		dig = 0;
	return (dig == nro[8]);
} // SE

function CheckIETO(ie) {
	if (ie.length != 9) {
		return false;
	}
	var nro = new Array(9);
	b = 9;
	soma = 0;
	for (var i = 0; i <= 8; i++) {
		nro[i] = CharToInt(ie.charAt(i));
		if (i != 8) {
			soma = soma + (nro[i] * b);
			b--;
		}
	}
	ver = soma % 11;
	if (ver < 2)
		dig = 0;
	if (ver >= 2)
		dig = 11 - ver;

	return (dig == nro[8]);
} // TO

// inscriÃ§Ã£o estadual antiga
function CheckIETOantigo(ie) {
	if (ie.length != 11) {
		return false;
	}
	var nro = new Array(11);
	b = 9;
	soma = 0;
	s = ie.substring(2, 4);
	if (s != '01' || s != '02' || s != '03' || s != '99') {
		for (var i = 0; i <= 10; i++) {
			nro[i] = CharToInt(ie.charAt(i));
			if (i != 3 || i != 4) {
				soma = soma + (nro[i] * b);
				b--;
			} // if ( i != 3 || i != 4 )
		} // fecha for
		resto = soma % 11;
		if (resto < 2) {
			dig = 0;
		}
		if (resto >= 2) {
			dig = 11 - resto;
		}
		return (dig == nro[10]);
	} // fecha if
}// fecha funÃ§Ã£o CheckIETOantiga

function CheckIEMG(ie) {
	if (ie.substring(0, 2) == 'PR')
		return true;
	if (ie.substring(0, 5) == 'ISENT')
		return true;
	if (ie.length != 13)
		return false;
	dig1 = ie.substring(11, 12);
	dig2 = ie.substring(12, 13);
	inscC = ie.substring(0, 3) + '0' + ie.substring(3, 11);
	insc = inscC.split('');
	npos = 11;
	i = 1;
	ptotal = 0;
	psoma = 0;
	while (npos >= 0) {
		i++;
		psoma = CharToInt(insc[npos]) * i;
		if (psoma >= 10)
			psoma -= 9;
		ptotal += psoma;
		if (i == 2)
			i = 0;
		npos--;
	}
	nresto = ptotal % 10;
	if (nresto == 0)
		nresto = 10;
	nresto = 10 - nresto;
	if (nresto != CharToInt(dig1))
		return false;
	npos = 11;
	i = 1;
	ptotal = 0;
	is = ie.split('');
	while (npos >= 0) {
		i++;
		if (i == 12)
			i = 2;
		ptotal += CharToInt(is[npos]) * i;
		npos--;
	}
	nresto = ptotal % 11;
	if ((nresto == 0) || (nresto == 1))
		nresto = 11;
	nresto = 11 - nresto;
	return (nresto == CharToInt(dig2));
}// MG

function validaIE(ie, estado) {
	ie = ie.replace(/\./g, '');
	ie = ie.replace(/\\/g, '');
	ie = ie.replace(/\-/g, '');
	ie = ie.replace(/\//g, '');
	if (ie == 'ISENTO')
		return true;
	switch (estado) {
	case 'MG':
		return CheckIEMG(ie);
		break;
	case 'AC':
		return CheckIEAC(ie);
		break;
	case 'AL':
		return CheckIEAL(ie);
		break;
	case 'AM':
		return CheckIEAM(ie);
		break;
	case 'AP':
		return CheckIEAP(ie);
		break;
	case 'BA':
		return CheckIEBA(ie);
		break;
	case 'CE':
		return CheckIECE(ie);
		break;
	case 'DF':
		return CheckIEDF(ie);
		break;
	case 'ES':
		return CheckIEES(ie);
		break;
	case 'GO':
		return CheckIEGO(ie);
		break;
	case 'MA':
		return CheckIEMA(ie);
		break;
	case 'MT':
		return CheckIEMT(ie);
		break;
	case 'MS':
		return CheckIEMS(ie);
		break;
	case 'PA':
		return CheckIEPA(ie);
		break;
	case 'PB':
		return CheckIEPB(ie);
		break;
	case 'PR':
		return CheckIEPR(ie);
		break;
	case 'PE':
		return CheckIEPE(ie);
		break;
	case 'PI':
		return CheckIEPI(ie);
		break;
	case 'RJ':
		return CheckIERJ(ie);
		break;
	case 'RN':
		return CheckIERN(ie);
		break;
	case 'RS':
		return CheckIERS(ie);
		break;
	case 'RO':
		return ((CheckIERO(ie)) || (CheckIEROantigo(ie)));
		break;
	case 'RR':
		return CheckIERR(ie);
		break;
	case 'SC':
		return CheckIESC(ie);
		break;
	case 'SP':
		return CheckIESP(ie);
		break;
	case 'SE':
		return CheckIESE(ie);
		break;
	case 'TO':
		return ((CheckIETO(ie)) || (CheckIETOantigo(ie)));
		break;// return CheckIETO(ie); break;
	}
}

function validaDesconto(id) {

	var seq = id.split('___')[1];

	var desc_informado = 0;
	var desc_max = 0;

	//var desc_informado = $('#desconto___' + seq).val();
	//var desc_max = $('#desc_max___' + seq).val();
	var desc_informado = isNull(Math.round(parseFloat($('#desconto___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var desc_max = isNull(Math.round(parseFloat($('#desc_max___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);

	if (desc_informado > desc_max) {
		FLUIGC.toast({
			title : 'Desconto: ',
			message : 'Desconto maior que o permitido.',
			type : 'warning',
			timeout : 'slow'
		});
		setTimeout("$('#desconto___'+seq).focus();", 1);
	} else {
		calculaTotal(id, 'S');
	}
}

function calculaTotal(id, exibe) {
	
	

	var seq = id.split('___')[1];
	
	if (/*$('#quantidade___' + seq).val()*/ isNull( Math.round( parseFloat( $('#quantidade___'+seq).val().replace(',','.') ) * 10000 ) / 10000, 1 ) > 0){
		$('#valUnitario___'+seq).prop('readonly', true);
	} else {
		$('#valUnitario___'+seq).prop('readonly', false);
		
		if ( $('#total___' + seq).val() != '0') {
			FLUIGC.toast({
				title : 'Quantidade: ',
				message : 'A quantidade deve não pode ser zero!',
				type : 'warning',
				timeout : 'slow'
			});
			
			return false;
		}
	}	
	
	var valTotal = 0.00;
	var pct_desc = 0.00;
	var qtdParcelas = document.getElementById('qtdVezes').value;
	var totalPorParcela = 0.00;

	var valUnitario = isNull(Math.round(parseFloat($('#valUnitario___' + seq)
			.val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var desconto = isNull(Math.round(parseFloat($('#desconto___' + seq).val()
			.replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	//var quantidade = isNull(Math.round(parseFloat($('#quantidade___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	//var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad_edit___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 1);
	
	var quantidade = isNull(Math.round(parseFloat($('#quantidade___' + seq).val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	var quant_mult = isNull(Math.round(parseFloat($('#qtd_pad_edit___' + seq).val().replace(',', '.')) * 10000) / 10000, 1);
	var val_invest = isNull(Math.round(parseFloat($('#val_invest').val()
			.replace('.', '').replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	totalPorParcela = (val_invest / qtdParcelas);
	console.log('TOTAL POR PARCELA ', totalPorParcela);
	var teste_divisao = quantidade / quant_mult;
	console.log('quantidade ',quantidade);
	console.log('quant_mult ',quant_mult);
	console.log('teste_divisao ',parseFloat(teste_divisao.toFixed(2)));
	if (!Number.isInteger(parseFloat(teste_divisao.toFixed(2)))){

		// $('#quantidade_edit').focus();
		setTimeout("$('#quantidade___'+seq).focus();", 1);

		FLUIGC.toast({
			title : 'Quantidade: ',
			message : 'A quantidade deve ser múltiplo de: '
					+ String(quant_mult.toFixed(2)),
			type : 'warning',
			timeout : 'slow'
		});
		$('#quantidade___' + seq).val($('#quantidadeaux___' + seq).val());
		return false;
	}

	var valTotal = valUnitario * quantidade;

	pct_desc = (valTotal * desconto) / 100;

	valTotal -= String((pct_desc).toFixed(2));

	var TotalConv = String((valTotal).toFixed(2)).replace(',', '');
	
	

	$('#total___' + seq).val(TotalConv);
	

	calculaTotParcela();

	var cotacao = 1;
	if ($('#cotacao').val() != null && $('#cotacao').val() !='') {
		cotacao = isNull(Math.round(parseFloat($('#cotacao').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	} else {
		cotacao = 1;
	}
	
	var totalreal = TotalConv*cotacao;
	$('#total_real___' + seq).val(String((totalreal).toFixed(2)).replace(',', ''));
	
	var totGeral = document.getElementById('totGeral').value;
	//totGeral = (isNull(Math.round(parseFloat(totGeral.replace('.', '').replace(',', '.')) * 10000) / 10000, 0)*cotacao);

	//testa o valor total permitido por parcela
	if (parseFloat(somaParcela) > parseFloat(totalPorParcela)) {
		if (exibe == 'S') {
			FLUIGC
					.toast({
						title : 'Validação: ',
						message : 'Valor total da parcela não pode ser maior que a quantidade do investimento dividido pelas parcelas!.',
						type : 'warning',
						timeout : 'slow'
					});
		}
		// setTimeout("$('#desconto___'+seq).focus();",1);
		$('#quantidade___' + seq).val($('#quantidadeaux___' + seq).val());
		calculaTotal(id, 'N');
		// removeLote(id,'N')
	} else {
		$('#quantidadeaux___' + seq).val($('#quantidade___' + seq).val());
	}

	//testa o valor total do investimento
	if (parseFloat(totGeral) > parseFloat(val_invest)) {
		if (exibe == 'S') {
			FLUIGC
					.toast({
						title : 'Validação: ',
						message : 'Valor total dos itens é maior que o valor do investimento.',
						type : 'warning',
						timeout : 'slow'
					});
		}
		// setTimeout("$('#desconto___'+seq).focus();",1);
		$('#quantidade___' + seq).val($('#quantidadeaux___' + seq).val());
		calculaTotal(id, 'N');
		// removeLote(id,'N')
	} else {
		$('#quantidadeaux___' + seq).val($('#quantidade___' + seq).val());
	}
}

function calculaTotParcela() {

	var nrParcela = document.getElementById('nrParcela').value;

	var somaP = 0.00;
	var somaG = 0.00;
	var pesoP = 0.00;
	var pesoG = 0.00;
	var cubP = 0.00;
	var cubG = 0.00;
	var cotacao = 1;
	if ($('#cotacao').val() != null && $('#cotacao').val() !='') {
		cotacao = isNull(Math.round(parseFloat($('#cotacao').val().replace('.', '').replace(',', '.')) * 10000) / 10000, 0);
	} else {
		cotacao = 1;
	}
	console.log('cotacao XXX ',cotacao);

	$("input[name^='total___']").each(function() {

		var seq = $(this).attr('name').split('___')[1];
		
		console.log('somaG ',somaG);
		somaG += (parseFloat($('#total___' + seq).val())*cotacao);
		console.log('somaG ',somaG);
		
		if (nrParcela == $('#parcelaID___' + seq).val()) {
			somaP += parseFloat($('#total___' + seq).val()*cotacao);
		}
	});

	$("input[name^='quantidade___']").each(function() {

		var seq = $(this).attr('name').split('___')[1];

		pesoG += parseFloat($('#quantidade___' + seq).val().replace(',', '.'))*parseFloat($('#peso___' + seq).val().replace(',', '.'));

		if (nrParcela == $('#parcelaID___' + seq).val()) {
			pesoP += parseFloat($('#quantidade___' + seq).val().replace(',', '.'))*parseFloat($('#peso___' + seq).val().replace(',', '.'));
		}
		console.log('pesop ',pesoP);
		console.log('pesoG ',pesoG);
	});

	$('#pesototal').val(String((pesoG).toFixed(3)).replace('.', ','));
	
	$("input[name^='cubagem___']").each(function() {

		var seq = $(this).attr('name').split('___')[1];

		cubG += parseFloat($('#quantidade___' + seq).val())*parseFloat($('#cubagem___' + seq).val().replace(',', '.'));

		if (nrParcela == $('#parcelaID___' + seq).val()) {
			cubP += parseFloat($('#quantidade___' + seq).val())*parseFloat($('#cubagem___' + seq).val().replace(',', '.'));
		}
	});

	$('#cubagem_total_geral').val(String((cubG).toFixed(6)).replace('.', ','));

	somaParcela = String((somaP).toFixed(2)).replace(',', '');
	$('#totParcela').val(somaParcela);

	somaGeral = String((somaG).toFixed(2)).replace(',', '');
	$('#totGeral').val(somaGeral);
}

function zoom(componente) {

	if (componente == 'btEndereco') {
		modalzoom
				.open(
						"Endereço de Entrega",
						"endereco_entrega",
						"sequencia,Seq.,end_entrega_compl,Endereço",
						"cliente,tip_endereco,sequencia,tip_logradouro,logradouro,num_iden_lograd,complemento_endereco,bairro_cobr_entga,cod_cidade,den_cidade,cod_uni_feder,den_uni_feder,cod_pais,den_pais,cod_cep,num_cgc,ins_estadual,end_entrega_compl",
						"cliente," + $('#cod_cliente').val()
								+ ",cod_uni_feder," + $('#estado_ent').val(),
						componente, 'list', 'default', null, null,
						"end_entrega_compl");
	}

}

function nrParcelas(qtdVezes) {

	nrParcela = document.getElementById('nrParcela');

	$('#nrParcela').empty();

	for (x = 1; x <= qtdVezes; x++) {
		nrParcela.options[x] = new Option(x, x);
	}

}

function mostradiv(nomedadiv, status) {

	if (status == 1) {
		document.getElementById(nomedadiv).style.display = 'block';
		document.getElementById('divNextStopButton').style.display = 'block';
		document.getElementById('divLabelNav').style.display = 'block';
		//document.getElementById('retira').style.display='block';
		//document.getElementById('divRetira')style.display='block';
	} else {
		document.getElementById(nomedadiv).style.display = 'none';
		document.getElementById('divNextStopButton').style.display = 'none';
		document.getElementById('divLabelNav').style.display = 'none';
		//document.getElementById('retira').style.display='none';
		//document.getElementById('divRetira').style.display='none';
	}
}

function isNull(valor, padrao) {
	if (isNaN(valor)) {
		return padrao;
	} else {
		return valor;
	}
}

function converteMoeda(valor) {

	if (valor == 'NaN') {
		valor = 0;
	}

	var inteiro = null, decimal = null, c = null, j = null;
	var aux = new Array();
	valor = "" + valor;
	c = valor.indexOf(".", 0);
	// encontrou o ponto na string
	if (c > 0) {
		// separa as partes em inteiro e decimal
		inteiro = valor.substring(0, c);
		decimal = valor.substring(c + 1, valor.length);
	} else {
		inteiro = valor;
	}

	// pega a parte inteiro de 3 em 3 partes
	for (j = inteiro.length, c = 0; j > 0; j -= 3, c++) {
		aux[c] = inteiro.substring(j - 3, j);
	}

	// percorre a string acrescentando os pontos
	inteiro = "";
	for (c = aux.length - 1; c >= 0; c--) {
		inteiro += aux[c] + '.';
	}
	// retirando o ultimo ponto e finalizando a parte inteiro

	inteiro = inteiro.substring(0, inteiro.length - 1);

	decimal = parseInt(decimal);
	if (isNaN(decimal)) {
		decimal = "00";
	} else {
		decimal = "" + decimal;
		if (decimal.length === 1) {
			decimal = "0" + decimal;
		}
	}

	valor = inteiro + "," + decimal;

	return valor;
}

function habilitaCampos(status, seq) {

	document.getElementById("desconto___" + seq).disabled = status
	// document.getElementById("btn_del___"+seq).disabled = status
	document.getElementById("quantidade___" + seq).disabled = status
	// document.getElementById("btn_add___"+seq).disabled = status

}

function validaCampo(param) {

	var retorno = true
	var ies_validou = false

	nrParcela = document.getElementById('nrParcela').value

	$("input[name^='cod_item___']")
			.each(
					function() {
						task = $('#task').val();
						if (param == 1 && !ies_validou && (task == 0 || task == 1 )) {
							FLUIGC
									.toast({
										title : 'Validação: ',
										message : 'Natureza de operação não pose ser alterada. Existe item informado',
										type : 'warning',
										timeout : 'fast'
									});
							$('#nat_operacao')
									.val($('#nat_operacao_aux').val());
							ies_validou = true
							retorno = false;
							return;
						}

						if (param == 2 && !ies_validou) {
							FLUIGC
									.toast({
										title : 'Validação: ',
										message : 'Empresa não pode ser alterada. Existe item informado',
										type : 'warning',
										timeout : 'fast'
									});
							$('#empresa').val($('#empresa_aux').val());
							ies_validou = true
							retorno = false;
							return;
						}

						if (param == 3) {

							// $('#parcelaID___'+seq).val();

							$("input[name^='parcelaID___']")
									.each(
											function() {

												var parcela_atual = $(this)
														.val()
												console.log('parcela_atual',
														parcela_atual)

												console.log('nrParcela',
														nrParcela)
												if (nrParcela == parcela_atual) {

													FLUIGC
															.toast({
																title : 'Validação: ',
																message : 'Lista de preço não pode ser alterada. Existe item informado',
																type : 'warning',
																timeout : 'fast'
															});
													$('#lstPreco').val(
															$('#lstpreco_aux')
																	.val());
													retorno = false;
													return false;
												} 
											});

							if (retorno == false || retorno == 'false')
								return false;
							
							$("input[name^='parcelaID___']")
							.each(
									function() {

										var moeda_atual = $('#cod_moeda_lista')
												.val()
										console.log('moeda_atual',
												moeda_atual)

										setMoedaLista();
										if ($('#cod_moeda_lista')
												.val() != moeda_atual) {

											FLUIGC
													.toast({
														title : 'Validação: ',
														message : 'Você não pode utilizar listas com moedas distintas!',
														type : 'warning',
														timeout : 'fast'
													});
											$('#lstPreco').val($('#lstpreco_aux').val());
											$('#cod_moeda_lista').val(moeda_atual);
											retorno = false;
											return false;
										} 
									});

							if (retorno == false || retorno == 'false')
								return false;
						}

						if (param == '4' && !ies_validou) {
							FLUIGC
									.toast({
										title : 'Validação: ',
										message : 'Quantidadade de vezes não pode ser alterada. Existe item informado',
										type : 'warning',
										timeout : 'fast'
									});
							$('#qtdVezes').val($('#qtdVezes_aux').val());
							ies_validou = true
							retorno = false;
							return;
						}

					});

	return retorno

}

function escolhefuncao(valor) {

	var retorno = validaCampo('4')

	if (retorno == true)
		nrParcelas(valor)
}