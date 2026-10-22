from django.shortcuts import render


def frontend(request, pk=None):
    return render(request, 'index.html')
