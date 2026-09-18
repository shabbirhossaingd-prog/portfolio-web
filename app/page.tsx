"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Film,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Play,
  Sparkles,
  Sun,
  WandSparkles,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { designProjects, motionProjects } from "@/lib/portfolio";

const heroLight = "data:image/webp;base64,UklGRsoaAABXRUJQVlA4WAoAAAAQAAAAnwAAxwAAQUxQSFQRAAABDAVt20gJf9jdpzsCETEBPK/uzI3tyJm5av/ihooTFxQ8YA1mOKR1C3h48y4MoJnDxdAf//+H3Pr/93zO7MasjVxqK6nt9ijNsW2rtt0e1rbtNrVtGxujze48NY/LZWd2dpI8ty/8FREOJduGoxvCPFnN24T3A7QiSbJkO2aXP4vL4BK4JgzCIAzSTkfNfU1nZlWP/iMCgiS5cZsNfUkiBYHALiTZeQD6P/GGsZdu+RjPoaSEhocGOxRs1VHPmbJopRqlisRER0dGRhaNjo6NDjG66rlBwI6oDm/1mTJ+7PAvu9ar2LhZy1Yd33q3R/2iz42KMzL6hWk7N86eMzP5ztWDy2dMGj3i989/GTDs26Sq3spzgBoWWzJh680RXdp3+O1ANqVUgO65u3bL/j2LZq4fXhypAZ+ji0SUH3j9mwY9+x7zMM+TK1fuZ3uYgPQ/+y/av+rcmYYBXy1RLDK815WBjX48wEDzaM+y8zSNE83Dl5ct3/Lbz3e6ugd4CisVEVFi7rJW31wHqhGqk7Tzu7adTM2jDNa9ltjrx0+Tc1oHdMJFY4pGtz7w3dBUoIxSlnH9/JnTl64+ytE4gfldWrfp/cOp80UDVwVjFFwspnSdIRs2e4ByrqVfPXLeRQBAp4xTOF63eGijxDdhYCAX0WWi414/lCUY45x5cjIZ6Ny0Ce+eT6oUHtspevat0EA1s1h1lqlS9eVv/3KtpzNu1toBE9rgiqUS4pq6OwVogREKrVKn277F7ovHZP3Boqq8pPufNIyPT3gyCKmBmYu2/XzWilMA7KiSRnBvOv9dqxd/ca2MVRUcYBfD3n3JTz/5YKYbqPRGmQWcM9j4Xp/1Tw42DKgdVhSMkeIMeTupzmunBOEG7g3TUxbuOHdv4UsJLeKrxioBcUmThIWUrdv65U8/rPTRTaAGD/n2MGVb7jpw8d64H5pXLl+3axxSAkIWo16Zunz7tnnJ93dv8gC16AvzoiZQeI7cONH31bj4pPf6zewZo2Dps/ON/QwAxNNsDsCt6uLt/k54y0PXjpwwdf6YSRPWXfwwQvKEUVS/bZvHDFpwReOCXxf2T8WYbuLpQ1fO43uuG8k3VjapECw3It57973Xvlpw+BFlpn8owhKBVrtlOoAAdnzYjEsPB9VQFanLF6u1HX8wCwB8tKzpYwe3UkFTN89Odn0VLjMwqtih4wUddMqYTZQyJeJigPRT5z8oojrkPUbBXQY8AkaZJYvrVgaUdRajgmes/SqhuLyDcgUN14Tme6xPsUe3oDM2EpGw6jv65Mzi0V1LSfu74SOd2OJsN9DTC2ZWLR8p98yC3lMndopQpPxuErEMTFlY6Na9u+sjYFTMt+9yjy+f2btjNJaR9ma66RpmgykQ7sp8sJv/gNyjfzcLDpKPFj48lzHr1y4b3rE+bF2EaRcT4F5cBTmkQ91/ObP6S6R6alv8pqqrjkBC4VRb6VJIi61gNqSy8IgItmz3yE2cUTfkvi2bMx/e9oIvdgfIvFNS72A9tQsJZW72rIdcbh5WX8vzefkdQfgkzfRExSDJIh64V8l2woVktMYDMa5tiYcOaH/oNPAwPhOpJ3OfwZpgLNORxY4A9adq7damnJO2yY1UaQUn96SkiCSsSISEe7VMpaFZv8xq1zVgOgO6e+nJs9o8JBEcX2SXLUjEo/cX0zKF69uSb92sLU/C4aOf1TJa/pyX7jvFFbaLRvilCdeOvi8NFGf0lzfuhdhQU2oflSFbI5PPDukUKsuJxeLKvrL9XvsBy0M1BUC69ulEYyJnuWni4vEeVWJtz+GMl0xVpo2ceqMkSj56uzOSJm1hzE3E/goxwVJACQqvuI4Q8+9OpIeNrHlLwQWFPeXCVClQpHjNCl+mckoXjddEOfSMOzojsKJMiBSGIez7us3f7LZRMHN0MIaKUlfP2+UCHX6JDJbCHW5w8bMqg8avI9Zsq4bVhxy5KgWHSyevXnjaFDtkULjOpP03Xkpcm8r8I3lL/hRYA1lLJo5zv4YkAEalf3oDboxdmCu43UW/lwzB52604ezw+PkwWZUCVZdW/wuAWrynj5O7M4ZUt8cqPfPa40yxuHSoDCh/65Oqo26be0ItsB7IPiRFDFosgD1b2rp2KcXeVXHBDseOnUt8adgpat0JRk5NaMsdQJgIGxgRcGHIwMYIF/pp6jQ4N3/6eR8kZTrImO6JmDt7JKmXd8xdsbCsggodYW9kAMsgVoYUd+RMUHAmx1TLOnHhyrsVCx84qu4/XNN9+DeMZHc6NKK5pofPvnzv0t8DKiJc+EXxXreB2PI6Um3QIpoCs6TQU9tObO0qhd+Jy3ziApY/LnFQDtK2JaUo6GROdTm+QWLlvUxh00jNVMQQwKxRiJZ5qAeWAdgZ0vgUWGH2dEd2tQ7NI5A5+P0qcvwIf3NbLuf+pU9p672rVCYK+iG5Gh59dVEf3ObDSliOD3oAzHjvULi0EOSiRTA850P/1S98u29RMQlOxLhSv8Ma8+urtdlLn3FICCsYXN7wIPNqFukgAwljtf4+YAVyNbqZi2buzNM33RplLeVodoQkXgI+4oockFjABKficTlJRt4K/jBPMIoGyxgG0WCFQ5bp8qBqJ+Eyro+HcuVVXo76PALcbIAkyTioyx19NU4rZs90xWfG8g51wRhJAufHOULAyeb0n7rL5r48/9s4eRZD4Cqr2ILAEwxnqxpHT7/ByObXQmSaFeqZdq8IeR52weBhl1d+e60Ekgl1b/5YYyTxFPrmExddpJu1Knvox8VMs/ef3VWfHQQ+VYKwTIioUvzf+0IHErT25eBGNaBBb8lmNZw/zNlUa4rPoIz/Mp95nn4lGVDtfe7PxX6pdkIOwMGWJuRAN4SRXEXXHdePH7rUjccUq3tXW+DRvw0lW8WElfDuX//+Z8kz28ajeAzVg3Cv6YodCsJYpqJUp292C8rtkdIMbBVUXGSs71JMdQaFSjQ36YyfeCQbgPuo1VjkI4QOYizv6rCuPbvGKRIVVQaec+1KFszWjpzwIifuyqXl5Tx4NK2ITJdXIlv3jEwEH1LR1AVZ/EE2KGOUiMPx8q2kK3JM9z1moOaE7OMTzJPjujOzXRTGkl3cgb4EEkKpJwjlT2s/g0qyru9aM62ZIuHillI3fYt0VMvLYTIwkZer5Vxa2D1IytUtX5jdExvMOucUiKMu7e6OET90Ko/ljG6KOQPU7zvbCFfbWgHRfWhwb8BXXSqHO7Gki79WgGatx7Iv5LarPgaDK0WGObCsi+eWgsfseBwE0a9WszujgSWAiv6ETObX3x2HliV+xqrNLAU+5PeYpZkPNKoFHzLPenw0AWGbMxpSTGTdyMmza5BUXdd9ouLhySGKrEAKeg+Iabl1RPsb1oLeOVFm+sPVJRGWd+H6r4RaL3FBt9rQLApy12ydHY5lXlnfG6g1ogK0B8ZY2o13kMzA5TN1q1CT+LJAp2nPKDxpIXWYB3bu1AnLlwJrb5lyaus3YRhJDBV9C578oUu8ImtuUgkseYhxzCHw5JO7u5j/Rmkkd1JQvMdD8tMzWeGFj4wFL5mnm+UmjYOcS26ZCERIvo+iJK2XA2H5Y4tCF8LjtxNCq3zLX1flJWIVB0D8jjrS7XddadKykwrGM+IRDozAsVnW1kG7QZ5hBGAazHX6y/I6UJ2Fr6NkyULNJMEyHfaUQIEBjGPPWAzCRX/RUjCR0jvGmib5rd4VnPibs91mMSo/Ny7RpxcNCpz4RRw8Bsxxd160djoJGoN99Y0rBk7lpb1AaCQOMZjInFUUBRRQ1GyAFampqJpBQ3/Y2G84gvz2K3bM7dq7ZVcJHBtTvr8GUgMshZy4L1tsKgcFG1J40jigElbxcvgQRPrexELBJRqk1kJK4MCBxoKmdEExsOuvbSBwvQRWAid/CZqv+TRSb+YQtbmpugGpAZO7mqMEg5/CJD2UAd70dYAkFVVPF9RONkuCkkAIyjPLyU/CihqES10Bwm2V7TM2TmCp1AVWHT4v9f3Hf5Qq4dxvmzqrjPu1lDf5vE/xJm8N+evH40bq3pJfyna+tKkfVGU1/8ZovmWfVWfTASD4sp94n57eyikmMBQ5ZaW+cxyMjRPtiq9XeP3y1YAp8I61Qk6HdAdgByq9FoBqZl/JF5b7dpE4gF1I9duVTapRlUgYHQpCre+CRv0ytq7bSy9Ov/Cwl1CQtqV3c8OHkuFwxWHWkqUGecxmKj9fJyZuae0jMQCAcxPaGSOA0/2Nxy7a8stJm1NBUCGEP/RWBZ31pDKiGU1H3/9yciFWDL6M+26ryySMn4WWzOxJbUUKkAxHDcKR1t7b4ULiJ2PFSOKapwDAiOljrURcXKptWvfFpYxQAmJsmPGSBX469h6vtphyC0BoxJ9YtYrfGoH9ZTdhcOGjUia1WaAEb63WyHMAQAxu8jd30bpE637m5NnYM55PNxKA9F3D2oQbr6sUWDgCKj/TDcAIsxwwRNdzzITaaZRiW10yoQQA4PbixChD1grGAKDXXMA16t9kNy+G+irT/buNbpAxShgA3J/W3NDEBXBW3BIwqVhfdW8BvyMwcD2J3JkGovkBqUHYGp9foqKgqAHpQKivlrD3JbYB4weFFhcLa7ZjGgMyWEGO/FGTrgEQq75QB6pxJ3qZAUMn5AEpp/rDIbkOsu2XKhjV2QigMT9d756aei4iJUGQuMnlop1Gnv6mei9pk9o3Dyiz3RWp40n2FeTL0D0FoTpUwOEWtogqitsJnPhzIdwNlSkE3ZqmB+QkmAZsXLh/ohPFu6xCdGyoiPnvMZtR81dfhu1RTDhcesEfUUXV7oJWkDNR0aU7aSOHILOMAMwvjxRsld9OA2qvzS/uxJHuKggkvGeeHovJa0rB9ZmFV+pAP4Nv5tw+orCxp2Q6m9W91Q7KwXC1BrAo1Cp/Vjo/zeIH4/DAHrOgKtk0n/yHoUyD/eXNra/DtWRZqPc2iZLQZqgsJ1vROioC10wjj5o5fI3c2k7WRJoJenlC3X6iEhNkPjMwXODQ00DzjOsTZWSlhYlQioG41X5mxkF9gYgTqOoBBctcA4dlrPLeoVIW5zZ5Zq51eNlQi5nVFqMbYAea64cmPT8jVLEDBUmUSt0E4Xw7OFATZosPJ7ZwB0xmlkQ8mC5mEE52WGzd3nFpN0gZDToDVwElQCUzdb+iPVN2JJPRSNq+jdCjAsNiFbhbNJiyrmfgT6minYNzHrMRVjzxwUZLvnqAIQNoSnki3m+dM1zWON+AmoB/MRgMNH/8nQZtB9IqxB76v9QPDJOUfdz8m3cRK98zcgKIVBvID/JoESB6YcX2VdSYVOedY3f7p7+Ad0z1YRRliWSiAUfQy93zXk+O8gg6xtKxYV4F2ZLp0KIpmYPBmYqYZCzPW6DrBZMgczyi+ViUiINoESJETe1y7uuUhlfUpHIAkGDW9iEh3J5OcXDSWgwQUbC3qyWN4az3y3c6B9+aUrKDVlcRdD1K78Mc2c1R6B6Y0Wsv5NmGU7kJE5e2drzFF4h8OwhhwntnizTeMMMdCOp5oR0h6ilwAreG2MGAtLYoK7MBNwHzDxyLMobxkDnGEVFJSe+oOBV+vIANOoZbQh3w/7jmnHakTrKZ8HkNKcz7HrzqSKLIH7jlYDiXvFIYRFHpvIH8t0+S+mTIaZ5z9NQRuVYm1OODDC9hLs/ZwNmz0fs+OWpcq3W35hin0LMN2vnjZZQDwQpnq4s+U93aPjiw9m01MAQ4qgX8L1Av0CpokPpbAFEVKMd94T2nEry0+BeUOVelD3HPwICEcpCWz+wOekcVBgEYpycSjHqYmLrUQZ1MaoF2QqGd0Da8mL6nMMzCd4kBOKszvILiQ9MFGEbxPtlJTAe7lWCQefakyeFMA1Xs2CV2t3NEx+vGRUlC3UofqoO7WxUfrq/jC4IbblZQOCBQCQAA8DoAnQEqoADIAD7VYKdPqCUjJqmxrCEAGollANTBIm4QQiVXcHNhs9E9NKgahYd+0G6zbwYduX32//s0xrvWuzMxLPHYjrPGEiZYj+eu+pkYbt3GUMBFzuSwRYD+IAGbqkMb/7EPMAxyE7yor/5YWLeqndNI921sedjcczZ/bSVOlIZ2Fkfl4iwjp4+qVeH0gPq3ML/EXYD3gh7fFOAE5R64DZWfF88vCnxG9soREalo6fJgCNph52NZ7AyJdaoqUB1/P3wx+g+2QUElZouKxfYUrYA4P9h+jq2Vds/tmDtn2MfAQ4Nqlm4JgY56SRV7uhY2HPQTcRuFvjvnnK5IyT0oskJ8ZIETUm76SDSyJ8tf30bqCScJdPlkZ0cq+wzK4m+nW457oz2TsAxgCLAT/ZeobMJDXV8HJox6nOFMYZH8f2fxnrpZukh/bLKJjZdCwuvC6f7/iOA8o+7ziWJTgkyHCbdavWP9oK48AuyG6nd05chrttutHMlNFti4b6uglVBP5my2E5+ZnBaRmmlGDh3aAG5Ac1GvLJ2+YoaRy04WRp+hVDap+/iRfl1LgWh6vVtysbegtZyEVtB/F1XBG1Sf7ZBgr3up2DgzmiSVfIosIgOrcYM+6grm0j6cxgZUAP7gBACWSG6tB8rCBLxJNq9oQ7inj5Uh91MROiUTQF5c68X/M6rJw3PEHnHoidm5rWSW5R9BnK0FjWSEr0WXck2dbgCC6CVT8BwCiUiqdBGSMs1+Cf14hVfNIhvcrQ5gS2eD5yHrvFSqlGubSjv6Sdq9mpfVvl4dGEwzK1kqUq96GZUA4Ij4vJEUcComKzNlSVnserWatP0alukmI83AvQblrym+TURYn5BuAm1TGehuMwAIe53i97V2EZlx0VmOFpNr7q1gj5HTS8fuiWbSwdtCDbzqcIoZj6iveiMy0unK57kjArJm9r6Niq5hA66WQjjXgdbkZzMIX9F+3aKFjJawWfbp9Nf1kNmZZ7l4UbtBGO5YmjqVWu7UG5LJljk4z4F0+4mNt+3cHgNas16VKAQvZimVjLSc4INzeQi8fHrmg3f/5cfWtCyBTgUYqlI5yLMZVZOYVOwi/fr5g6I4A29Uygm7T9T/gEMdA4WS6FsU2VT4QIO7HkYrT6TARLQmomI3JpuVjoNUTnbGti/Q1bTdVTOGfXI7mNo7prapWX6CnqebKswFhLnGsEo9kEmb7uiDUYoh4NbXdxVdeqL8ptpAyIeeFt/n/92F9acTbYs+9oJ/L4DhIgKC/DuUDLS0w4xn9fqDm4ZZPbevNlAlGKLiESRnLZrykxwuZYcQosKg8LtaKJVX7Ej7DMKbeZRx7I9gwOXEhou4Kif2RBJpqX4diOPfE6WF34bSRBEymF4F0EZVHjMRbzIpGvVnm+gFs9c/bFwDeDCFvC4EhW05XrJhbaGlY4vH+SvZEYqjtnapKoBw7Aic4wyXY3mXvo/mYre03n8kZd315jNjjOND/XpAIXIf6uKM4tnSjY2GfOU6pGDFNYYIdCIxEzfuu3iSOLuwkSPYVsR1oTsdo0oSFmZDd3ZP9mFgp1sIeoAY/0NqM/G78pEfh7dnaojCBHNX9JU/bpTdAWT4SwONoicV3bu6BP+yJz/ZXPNMXgabRsXecNi65Md2A2jrynzcsuceBrZRkkIZaCZsvXsyGJAE1kpQqIDTGfV54EExfIAFNFJBT7vcT7WmAgcXRXiJpqWnbaKKq21NYpLd8cICweeid/Q7zZ2BLPZYh9gsl2BOvm8k8+TdR5cA2i6yOOXEYfU2NB3Zprhc38SP2F73+DdgvqCKSb5RP1rQPc07OmoKFhXXdmo+Ep+PTVZsIzaSESoQB5UkQWm4NnHz5aeSdJGyuW3k4bLwKDqWUAklb1SYj2NeuVpj0O75BvLxMvN8JrfnsWk6ZaoVZzVrUxwdVsh42hX3XO88vEwGchq17KETrHSo5MV9Ak1evKEyolkbpINkIRyb/kGAOaZRLk5vHP3pMnn7Q3S2cfCMJNVllcFb1UvZaiFJkUft0rGwRkcxxh2JNgTib4dv7gMF23vHOGJCFMXEze2GhSFzTDKiegLt3DoGh1WScZmw2JVwAqmC0qm69X/3UxBTOZAbQ+Q8puVznNR/TLG967EGEzKf4By/jYDxAnDZuLhEZCEvboIM+tqANwolHxJaqPtsF16yf/As5mijSz46qaPPyFV/zE2r3k3UGeFa/SyK66zGFrONeo6yXbEmu+W6ZXswDqlscS+Pi4QK/q/v4m+mEFzNF3Pmk6c1fFuj+kdvlaHB0FSetD+R4X9uG7kzyTeFsL5cDb8LH97crA3wEvJW9a0yBPNqraSe+n5eDLZ9ZXZcu3G9n3UB//YK//2AD//2VROwx0b4/dztb0MtNkvklYY4/MtQGEuec2GpL59NxyLsFpEegQ+HUlDOf2Gh4nBg00fiXgp1shIufpTG6Lhl3i+lANLRuJIW2pgN/tjT7QQa2AZs7OphVWTG9UvvdawGsORtHdSP2FIi7up84o6oCKYCytSNK1tpDngPnT4eCzyh+LB6xpJJZFq6StWeFHH8vsCSznKPIiCs58ZFFhsDQX5IJN8jZ23nMgjARZthyW7rwWvBlnY9Kty2tC3AeWOZik1RekzPmFHG5E6SbcGcARXAjsSRTWVmuY4u8cHJD/TGtXsrfm+qxDVh4fBNIH0eKeCKmEVDsHqnXWSthTp9j25mUP85gZpywRY/9apC3ij3i2Tbe/eCvunxik4HT0jwFUqhc26mMfwZiAJgLp9lGEwHWmuVu7AncsxPWz8h8KJMCZGiJAZ53NsehVukH+OVUZM7sXHPuyNS9wOUKsu6OTCzggdjEegjKlZkEQdZXsqocaMH30WhL0Zk159rVpBUWiMXLB5udgQiLVsCdvkoFNKJuPOzTr5A6keq0mEFXOdALi+avSaoUTV5rK8DE2VDwCSrIzxIH3kPH5yHKaleBT/pse01oN8DFqxtjG129QP70YlKWim4D7oGBeqWi2U3EhxwZuAzCtkeoGdcZPTWUpreVhn5066j2LiJKyTL96j7iF1kkWyDEVSW/aWGKdoLLtETOGn5VoDx51RFrVXslVwpwTtwGr/T+D/gLrHT6gXbVIIc4OAdnAeHsjeH92vkHRuE+gWF6zRx26BE+HcJBJWN2UwAAAA=";
const heroDark = "data:image/webp;base64,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";

const journey = [
  { no: "01", year: "2022", title: "Graphic Design", note: "Started building visual systems through layout, branding and social media design." },
  { no: "02", year: "2023", title: "Brand & Social", note: "Developed a sharper eye for campaign consistency, visual hierarchy and brand storytelling." },
  { no: "03", year: "2024", title: "Video Editing", note: "Expanded into editing, pacing, transitions and short-form visual storytelling." },
  { no: "04", year: "NOW", title: "Design + Motion", note: "Blending static design and motion into one focused personal creative practice." },
];

const software = [
  { code: "Ps", name: "Adobe Photoshop", use: "Image editing, compositing, social design" },
  { code: "Ai", name: "Adobe Illustrator", use: "Logo, vector, brand identity" },
  { code: "Pr", name: "Adobe Premiere Pro", use: "Video editing, reels, promotional cuts" },
  { code: "Ae", name: "Adobe After Effects", use: "Motion graphics, type animation, compositing" },
];

const faqs = [
  ["What can I hire you for?", "Logo and brand identity, social media design, posters, company profiles, video editing, reels and motion graphics."],
  ["Can I contact you for a full-time role?", "Yes. Use the hiring form below and include the role, company, timeline and any important details."],
  ["Can you work remotely?", "Yes. I am based in Dhaka, Bangladesh and work with remote projects and collaborations."],
];

function Tip({ children, text, className = "" }: { children: React.ReactNode; text: string; className?: string }) {
  return <span className={"hover-tip " + className} data-tip={text}>{children}</span>;
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  const changeTheme = (value: "light" | "dark") => {
    setTheme(value);
    window.localStorage.setItem("portfolio-theme", value);
  };

  return (
    <main className={"mono-page theme-" + theme}>
      <header className="mono-nav">
        <a href="#home" className="mono-name"><Tip text="Graphic Designer · Video Editor">Shabbir Azhaf</Tip></a>
        <nav>
          <a href="#design"><Tip text="Selected graphic design">Design</Tip></a>
          <a href="#motion"><Tip text="Video editing & motion">Motion</Tip></a>
          <a href="#software"><Tip text="Creative toolkit">Software</Tip></a>
          <a href="#contact"><Tip text="Hiring & project inquiry">Contact</Tip></a>
        </nav>
        <div className="nav-actions">
          <div className="theme-switch" aria-label="Theme selector">
            <button className={theme === "light" ? "active" : ""} onClick={() => changeTheme("light")} aria-label="Light mode">
              <Sun size={14} />
            </button>
            <button className={theme === "dark" ? "active" : ""} onClick={() => changeTheme("dark")} aria-label="Dark mode">
              <Moon size={14} />
            </button>
          </div>
          <a href="#contact" className="mono-pill">Hire Me <ArrowUpRight size={14} /></a>
        </div>
      </header>

      <section className="mono-hero" id="home">
        <div className="hero-copy-top">
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <span className="status-dot" /> Available for selected projects
          </motion.span>
          <span>Dhaka, Bangladesh · Remote</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .75, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Tip text="Design that communicates before it decorates">Visuals with clarity.</Tip>
          <br />
          <em><Tip text="Motion that adds rhythm, not noise">Motion with character.</Tip></em>
        </motion.h1>

        <div className="hero-portrait-stage">
          <img className="hero-portrait-blur" src={theme === "dark" ? heroDark : heroLight} alt="" aria-hidden="true" />
          <motion.img
            key={theme}
            className="hero-portrait-main"
            src={theme === "dark" ? heroDark : heroLight}
            alt="Shabbir Hossain Azhaf"
            initial={{ opacity: 0, scale: .985, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: .5 }}
          />
          <div className="portrait-edge-fade" />
          <div className="portrait-mode">
            <button className={theme === "light" ? "active" : ""} onClick={() => changeTheme("light")}>White</button>
            <span>/</span>
            <button className={theme === "dark" ? "active" : ""} onClick={() => changeTheme("dark")}>Black</button>
          </div>
        </div>

        <div className="hero-bottom">
          <p>
            <Tip text="Personal portfolio statement">
              I’m Shabbir Hossain Azhaf — a graphic designer and video editor creating clean brand visuals, social design and motion-led stories.
            </Tip>
          </p>
          <div className="hero-links">
            <a href="#design">Explore work <ArrowUpRight size={15} /></a>
            <a href="mailto:shabbirhossain.gd@gmail.com">Email me <Mail size={15} /></a>
          </div>
        </div>
      </section>

      <section className="mono-section" id="design">
        <div className="section-kicker"><span>01</span><Tip text="Graphic design portfolio">Selected Design</Tip></div>
        <div className="section-title-row">
          <h2><Tip text="Logos, social media, profiles and print">Built to feel simple.<br />Designed to stay memorable.</Tip></h2>
          <p>Separate design portfolio for brand identity, social media posters, company profiles and campaign visuals.</p>
        </div>

        <div className="mono-work-grid">
          {designProjects.map((project, index) => (
            <motion.article
              className="mono-work-card"
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: .5, delay: index * .06 }}
            >
              <div className={"mono-work-art art-" + (index + 1)}>
                <span className="work-index">0{index + 1}</span>
                <div className="poster-window">
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                  <small>Shabbir Azhaf · {project.year}</small>
                </div>
                <div className="abstract-mark mark-a" />
                <div className="abstract-mark mark-b" />
              </div>
              <div className="mono-work-meta">
                <div>
                  <h3><Tip text={project.description}>{project.title}</Tip></h3>
                  <span>{project.category}</span>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section motion-wrap" id="motion">
        <div className="section-kicker"><span>02</span><Tip text="Video editing & motion graphics">Motion / Video</Tip></div>
        <div className="section-title-row">
          <h2><Tip text="Dedicated motion portfolio">Frames with rhythm.<br />Edits with purpose.</Tip></h2>
          <p>Video stays separate from static design. YouTube links can later play inside the site through the admin portfolio system.</p>
        </div>

        <div className="mono-motion-grid">
          {motionProjects.map((project, index) => (
            <motion.article
              className="mono-motion-card"
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .5, delay: index * .07 }}
            >
              <div className={"mono-video-art video-" + (index + 1)}>
                <div className="video-orbit" />
                <button aria-label={"Preview " + project.title}><Play size={18} fill="currentColor" /></button>
                <span className="video-label">{project.category}</span>
              </div>
              <div className="mono-work-meta">
                <div>
                  <h3><Tip text={project.description}>{project.title}</Tip></h3>
                  <span>{project.year}</span>
                </div>
                <Film size={18} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section software-section" id="software">
        <div className="section-kicker"><span>03</span><Tip text="Software I use every day">Creative Toolkit</Tip></div>
        <div className="software-heading">
          <h2><Tip text="Hover every app to see how I use it">The tools are quiet.<br />The ideas do the talking.</Tip></h2>
          <WandSparkles size={30} />
        </div>

        <div className="software-grid">
          {software.map((item, index) => (
            <motion.article
              className="software-card"
              key={item.code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * .06 }}
            >
              <div className="software-icon">{item.code}</div>
              <div>
                <strong>{item.name}</strong>
                <span>{item.use}</span>
              </div>
              <div className="software-popup">{item.use}</div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section journey-section" id="about">
        <div className="section-kicker"><span>04</span><Tip text="No company list — only the creative path">Creative Journey</Tip></div>
        <div className="journey-head">
          <h2><Tip text="A simple serial timeline">Learning, refining,<br />then combining both worlds.</Tip></h2>
          <p>No company names. No résumé-style block. Just the progression of the craft, shown in order.</p>
        </div>

        <div className="journey-list">
          {journey.map((item) => (
            <motion.article
              key={item.no}
              className="journey-row"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span>{item.no}</span>
              <span className="journey-year">{item.year}</span>
              <h3><Tip text={item.note}>{item.title}</Tip></h3>
              <p>{item.note}</p>
              <Sparkles size={16} />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mono-section faq-section">
        <div className="faq-intro">
          <div className="section-kicker"><span>05</span><Tip text="Quick project answers">Before we work together</Tip></div>
          <h2>Simple questions.<br /><em>Clear answers.</em></h2>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a], index) => (
            <button key={q} className={openFaq === index ? "open" : ""} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
              <div><span><Tip text="Click to expand">{q}</Tip></span><ChevronDown size={18} /></div>
              <p>{a}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mono-contact" id="contact">
        <div className="contact-copy">
          <div className="section-kicker invert"><span>06</span><Tip text="Freelance · Collaboration · Full-time">Let’s work together</Tip></div>
          <h2>Hiring?<br />Launching something?<br /><em>Send it my way.</em></h2>
          <p>Use the form for a project, collaboration, freelance request or full-time creative opportunity.</p>

          <div className="social-row">
            <a href="https://www.linkedin.com/in/designerazhaf/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
            <a href="https://wa.me/8801701523130?text=Hi%20Shabbir%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
            <a href="https://www.instagram.com/grapeobd/" target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram</a>
            <a href="https://www.behance.net/azhafahmed" target="_blank" rel="noreferrer"><Palette size={17} /> Behance</a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="mono-footer">
        <div><strong>Shabbir Hossain Azhaf</strong><span>Graphic Designer / Video Editor</span></div>
        <div><a href="#design">Design</a><a href="#motion">Motion</a><a href="#software">Software</a><a href="#contact">Contact</a></div>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
